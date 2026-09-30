import React, { useState } from 'react';
import type { JurisdictionType } from '../../types';
import { Card, Input, Textarea, Button } from '../ui';
import { JurisdictionSegmentedControl } from './JurisdictionSegmentedControl';
import { AssessmentProgress } from './AssessmentProgress';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface IntakeStageOneProps {
  productName: string;
  productDescription: string;
  jurisdiction: JurisdictionType;
  canNavigateToStage2: boolean;
  onSelectStage: (stage: 1 | 2) => void;
  onUpdate: (fields: { productName?: string; productDescription?: string; jurisdiction?: JurisdictionType }) => void;
  onNext: () => void;
}

export const IntakeStageOne: React.FC<IntakeStageOneProps> = ({
  productName,
  productDescription,
  jurisdiction,
  canNavigateToStage2,
  onSelectStage,
  onUpdate,
  onNext
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<{ productName?: string; productDescription?: string }>({});
  const [touched, setTouched] = useState<{ productName?: boolean; productDescription?: boolean }>({});

  const validate = () => {
    const newErrors: { productName?: string; productDescription?: string } = {};

    if (!productName || !productName.trim()) {
      newErrors.productName = 'Product name is required.';
    }

    if (!productDescription || !productDescription.trim()) {
      newErrors.productDescription = 'Please describe your product before continuing.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ productName: true, productDescription: true });

    if (validate()) {
      onNext();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ productName: e.target.value });
    if (touched.productName) {
      if (!e.target.value.trim()) {
        setErrors((prev) => ({ ...prev, productName: 'Product name is required.' }));
      } else {
        setErrors((prev) => ({ ...prev, productName: undefined }));
      }
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ productDescription: e.target.value });
    if (touched.productDescription) {
      if (!e.target.value.trim()) {
        setErrors((prev) => ({ ...prev, productDescription: 'Please describe your product before continuing.' }));
      } else {
        setErrors((prev) => ({ ...prev, productDescription: undefined }));
      }
    }
  };

  const handleStageClick = (stage: 1 | 2) => {
    if (stage === 2) {
      setTouched({ productName: true, productDescription: true });
      if (validate()) {
        onSelectStage(2);
      }
    } else {
      onSelectStage(1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-pop">
      {/* Title & Introductory Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t('app_title', 'IP-SAKTI Sahayak')}
        </h1>
        <p className="text-sm sm:text-base font-medium text-foreground-subtle">
          {t('app_subtitle', 'Intelligent IP & Regulatory Guidance for Ayurveda')}
        </p>
        <p className="text-xs text-foreground-muted max-w-lg mx-auto leading-relaxed pt-1">
          {t('app_desc', 'Understand the intellectual property and regulatory considerations surrounding your Ayurvedic product.')}
        </p>
      </div>

      <AssessmentProgress
        currentStage={1}
        canNavigateToStage2={canNavigateToStage2}
        onSelectStage={handleStageClick}
      />

      {/* Frame 01 Form Card */}
      <Card className="p-6 sm:p-8 space-y-6 bg-background-surface border-border shadow-subtle">
        <form onSubmit={handleNext} className="space-y-6" noValidate>
          {/* Product Name */}
          <Input
            label={t('product_name_label', 'Product Name')}
            placeholder={t('product_name_placeholder', 'e.g. Ashwagandha Immunity Elixir')}
            value={productName}
            onChange={handleNameChange}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, productName: true }));
              if (!productName.trim()) {
                setErrors((prev) => ({ ...prev, productName: 'Product name is required.' }));
              }
            }}
            error={touched.productName ? errors.productName : undefined}
            autoFocus
          />

          {/* Product Description */}
          <Textarea
            label={t('product_desc_label', 'Product Description')}
            placeholder={t('product_desc_placeholder', 'Describe composition, botanical ingredients, preparation method, and intended use...')}
            value={productDescription}
            onChange={handleDescriptionChange}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, productDescription: true }));
              if (!productDescription.trim()) {
                setErrors((prev) => ({ ...prev, productDescription: 'Please describe your product before continuing.' }));
              }
            }}
            error={touched.productDescription ? errors.productDescription : undefined}
            className="min-h-[120px]"
          />

          {/* Jurisdiction Segmented Toggle */}
          <JurisdictionSegmentedControl
            value={jurisdiction}
            onChange={(j) => onUpdate({ jurisdiction: j })}
          />

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>{t('btn_next', 'Continue to Classification')}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
