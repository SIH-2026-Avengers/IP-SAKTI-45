from langchain_huggingface import HuggingFaceEmbeddings

from config import EMBEDDING_MODEL_NAME


def create_embedding_model():
    """
    Create the local HuggingFace embedding model.
    """

    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME
    )