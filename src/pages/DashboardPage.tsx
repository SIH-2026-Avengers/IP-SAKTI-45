import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { useJurisdiction } from '../context/JurisdictionContext';
import { AssessmentDashboard } from '../components/dashboard/AssessmentDashboard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { input, resetAssessment, setIsDashboardActive } = useAssessment();
  const { jurisdiction } = useJurisdiction();

  useEffect(() => {
    setIsDashboardActive(true);
    return () => setIsDashboardActive(false);
  }, [setIsDashboardActive]);

  const handleRestart = () => {
    resetAssessment();
    navigate('/');
  };

  return (
    <div className="py-2 sm:py-6">
      <AssessmentDashboard
        productName={input.productName}
        productDescription={input.productDescription || ''}
        jurisdiction={jurisdiction}
        classificationAnswers={input.classificationAnswers}
        onRestart={handleRestart}
      />
    </div>
  );
};
