# Incremental Classifier and User-Selected RAG Scope

## Purpose

The classifier predicts a statutory category from the intake answers. The RAG pipeline uses a category and jurisdiction to restrict which indexed document chunks can be retrieved. Users need an explicit way to select or override the RAG category without silently changing the classifier's prediction.

This report maps the current implementation and the River incremental-learning path.

## Current request flow

1. `src/context/AssessmentContext.tsx` submits the intake features to `POST /api/classify` and stores the predicted category.
2. `src/components/dashboard/ClassificationDistributionChart.tsx` lets a user select one of the returned top-five categories.
3. `src/components/dashboard/AssessmentDashboard.tsx` stores that choice as `activeRagCategory`.
4. `src/components/layout/AppLayout.tsx` passes the active category to the floating assistant in `src/components/rag/RagAssistant.tsx`.
5. The assistant sends `category` to `POST /api/rag/query`.
6. `backend/main.py` forwards that category to `IPSaktiService.ask`; `backend/rag/pipeline.py` passes it into retrieval.
7. `backend/retrieval/filters.py` builds an exact jurisdiction-and-category metadata filter; `backend/retrieval/retriever.py` searches only matching chunks. `backend/rag/context_builder.py` turns the reranked chunks into generator context.

The override is incomplete today: the dashboard chart offers only top-five results, while `src/pages/AssistantPage.tsx` sends the classifier's predicted category instead of the user-selected category. `GET /api/categories` already provides the full supported category list. The selected category should be explicit, visible, and consistently used by every RAG surface; it should not overwrite the classifier result or be described as a corrected prediction unless the user confirms that separately.

## User override implementation map

| Area | Files | Change needed |
| --- | --- | --- |
| Category selection | `src/components/dashboard/ClassificationDistributionChart.tsx`, `src/components/dashboard/AssessmentDashboard.tsx` | Preserve the useful top-five exploration, and add a selector for any supported category if the user needs to search beyond those five. Clearly distinguish predicted from selected category. |
| Shared state | `src/context/AssessmentContext.tsx` | Store prediction and user-selected retrieval category separately. Initialize selection from the prediction; preserve it across dashboard/assistant navigation and reset it with the assessment. |
| Standalone assistant | `src/pages/AssistantPage.tsx`, `src/services/assistant.ts` | Send the shared selected RAG category, not always `predictedCategory`. |
| Floating assistant | `src/components/layout/AppLayout.tsx`, `src/components/rag/RagAssistant.tsx` | Continue sending the selected category and update its context label when the selection changes. Consider whether an already-open conversation must reset when category changes. |
| API client/types | `src/services/api.ts`, `src/types/backendApi.ts` | Add a typed categories request if selection options should come from `GET /api/categories`; keep RAG request `category` as the selected category. |
| Backend contract | `backend/main.py`, `backend/services/ip_sakti_service.py` | Validate category against the supported category set and echo the effective category. Keep classification and retrieval category as distinct request concepts. |
| Retrieval/context | `backend/retrieval/filters.py`, `backend/retrieval/retriever.py`, `backend/rag/pipeline.py`, `backend/rag/context_builder.py` | Existing code already performs category-filtered retrieval and builds context; change only if product requirements include multiple categories, cross-category retrieval, or document-level selection. |
| Corpus organization | `backend/ingestion/metadata.py`, `backend/data/raw/`, `backend/data/vectorstore/` | Folder names determine category metadata during ingestion. A UI category override does not move files; it chooses the metadata category used for retrieval. Re-ingest only when corpus organization/metadata changes. |

`backend/main.py` currently accepts a category for RAG but overrides the requested jurisdiction to India in its call to `service.ask`. That is separate from category selection and should be reviewed if international retrieval is brought into scope.

## Incremental learning implementation

The serving adapter is `backend/classifier/classifier.py`, invoked by `backend/services/ip_sakti_service.py`. It loads the River model from `backend/models/IPShaktiRiverClassifier.pkl` and preserves the existing `predict(features)` response contract. If the model artifact is absent, it bootstraps and persists from `backend/notebook/Temp/rag_router_dataset_v1_10000.csv`. The 100k synthetic CSV in the same folder has a different feature schema and seven product-type labels, so it is deliberately not used for the twelve statutory classes.

`POST /api/classifier/feedback` receives a unique feedback ID, the exact feature snapshot used for the assessment, and the user-selected statutory category. The floating and full-page assistants queue a user category change and submit one incremental `learn_one` update when a question is asked using that category. The model is saved atomically; duplicate feedback IDs do not apply a second update. This feedback influences future predictions, not the current assessment result.

The notebook and `backend/scripts/train_incremental_classifier.py` share the same training adapter. Unit coverage in `backend/scripts/test_incremental_classifier.py` checks ranked probabilities, persistence, duplicate feedback, and input validation. River `0.26.1` is pinned in both backend dependency manifests.

## River starting points

- `preprocessing.OneHotEncoder() | linear_model.SoftmaxRegression()` is a compact multiclass online baseline for categorical intake fields and provides `learn_one` and `predict_proba_one`.
- `tree.HoeffdingTreeClassifier` is an incremental tree baseline; `HoeffdingAdaptiveTreeClassifier` is the tree option to compare when concept drift is a primary concern.
- `forest.ARFClassifier` and `ensemble.ADWINBaggingClassifier` are more complex adaptive ensembles; benchmark them before accepting their added memory/latency cost.
- `drift.ADWIN` detects changes in a monitored scalar stream. Feed it observed loss/error only after a trusted label arrives. Without labels, it cannot establish that classification accuracy has degraded.
- River's `utils.Rolling` is for rolling statistics; it is not by itself a bounded training set that makes a learner forget old examples. If training must use only the most recent N examples, store that bounded history and explicitly rebuild/replay, or adopt a model with a deliberate forgetting strategy.
- `evaluate.progressive_val_score` supports stream-ordered evaluation and delayed labels. Keep all examples from the same product/user together when splitting or replaying data to reduce leakage.

## Feedback semantics and safeguards

A RAG category selection expresses search intent and is not guaranteed to be a ground-truth class. Per the requested workflow, using a changed category for a question also treats that choice as a weak online label for the current assessment features. This can bias future predictions if search intent differs from the desired class. The selected category never overwrites the current prediction. The UI queues one update per category change and submits it only when a question is sent in that category:

- A new `feedback_id` is attached to each user category change and persisted with the model for retry-safe idempotency.
- The exact ten-feature assessment snapshot is sent with the selected category; RAG-only requests without an assessment do not train.
- A failed feedback request is shown to the user and remains retryable on a subsequent question.

This local model file survives process restarts on a persistent filesystem. Render's current service configuration does not define a persistent disk or shared model store, so updates can be lost on redeploy and are not synchronized across multiple instances; production multi-instance durability requires deployment-backed shared storage.

## Deployment and environment notes

- Render uses `render.yaml` to install `backend/requirements.txt`; the frontend static build uses `npm install` and `npm run build`.
- The frontend's `VITE_API_BASE_URL` must be the backend's public URL. `render.yaml` now references the backend's `RENDER_EXTERNAL_URL`; the private `host` property is not browser-reachable.
- `backend/pyproject.toml` declares Python `>=3.12,<3.13`; Render sets `PYTHON_VERSION=3.12.0`. Keep those aligned unless Python support is intentionally expanded and tested.
- The serialized scikit-learn model was produced with scikit-learn 1.6.1. River will be a new runtime dependency, but Jupyter/IPykernel should remain development-only.
- Local venvs and `node_modules` are ignored by `.gitignore`; commit manifests, notebook, and this report, not environment binaries or package caches.
- For online learning to survive restarts and work with more than one Render instance, model state and feedback need durable shared storage or a controlled external training/update service. An in-memory model is not sufficient for production persistence.

## Acceptance checks before enabling updates

1. A selected RAG category is used by both assistant surfaces and the effective category is visible in the response/UI.
2. Invalid categories fail clearly; valid categories with no indexed chunks return an explicit empty-results response.
3. A changed category is learned once, on the next question using that category; retrying the same feedback ID does not duplicate the update.
4. The River model preserves the current response schema and returns stable top-five probabilities, including before all classes have appeared in the stream.
5. Progressive evaluation beats a documented baseline on agreed metrics before any online model is promoted.
6. Model and feedback survive restart, concurrent requests cannot corrupt state, and Render builds from the committed manifests with its configured Python 3.12 runtime.