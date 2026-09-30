import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { JurisdictionProvider } from './context/JurisdictionContext';
import { AssessmentProvider } from './context/AssessmentContext';
import { AppLayout } from './components/layout/AppLayout';
import { IntakePage } from './pages/IntakePage';
import { ClassificationPage } from './pages/ClassificationPage';
import { DashboardPage } from './pages/DashboardPage';
import { EvidencePage } from './pages/EvidencePage';
import { AssistantPage } from './pages/AssistantPage';

export function App() {
  return (
    <LanguageProvider>
      <JurisdictionProvider>
        <AssessmentProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<IntakePage />} />
                <Route path="/classification" element={<ClassificationPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/evidence" element={<EvidencePage />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AssessmentProvider>
      </JurisdictionProvider>
    </LanguageProvider>
  );
}

export default App;
