import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./css/ProcessorWizard.css";
import Step1ScreenConfirmation from "./steps/Step1ScreenConfirmation";
import Step2BrandSelection from "./steps/Step2BrandSelection";
import Step3ApplicationSelection from "./steps/Step3ApplicationSelection";
import Step4InputSelection from "./steps/Step4InputSelection";
import Step5OutputSelection from "./steps/Step5OutputSelection";
import Step6Configuration from "./steps/Step6Configuration";
import Step7Results from "./steps/Step7Results";
import { useProcessorWizard } from "../../hooks/useProcessorWizard";
import type {
  ScreenData,
  CalculationRequest,
} from "../../hooks/useProcessorWizard";

interface ProcessorWizardProps {
  screenData: ScreenData;
  onClose: () => void;
}

const ProcessorWizard: React.FC<ProcessorWizardProps> = ({
  screenData,
  onClose,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CalculationRequest>>({
    screenData,
    selectedBrand: "NovaStar",
    selectedApplications: [],
    selectedMainInputType: "HDMI",
    selectedAuxiliaryInputs: {},
    selectedOutputType: "RJ45",
    selectedAuxiliaryOutputs: {},
  });

  const {
    loading,
    error,
    solutions,
    selectedSolution,
    calculateSolutions,
    selectSolution,
    sendConfigurationEmail,
    sendQuoteRequest,
  } = useProcessorWizard();

  const handleNext = async () => {
    if (currentStep === 6) {
      // Last step before results - calculate solutions
      try {
        await calculateSolutions(formData as CalculationRequest);
        setCurrentStep(7);
      } catch (err) {
        console.error("Error calculating solutions:", err);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<CalculationRequest>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ScreenConfirmation screenData={screenData} />;
      case 2:
        return (
          <Step2BrandSelection
            selectedBrand={formData.selectedBrand || "NovaStar"}
            onBrandChange={(brand) => updateFormData({ selectedBrand: brand })}
          />
        );
      case 3:
        return (
          <Step3ApplicationSelection
            selectedApplications={formData.selectedApplications || []}
            onApplicationsChange={(apps) =>
              updateFormData({ selectedApplications: apps })
            }
          />
        );
      case 4:
        return (
          <Step4InputSelection
            selectedMainInput={formData.selectedMainInputType || "HDMI"}
            selectedAuxiliary={formData.selectedAuxiliaryInputs || {}}
            onMainInputChange={(input) =>
              updateFormData({ selectedMainInputType: input })
            }
            onAuxiliaryChange={(auxiliary) =>
              updateFormData({ selectedAuxiliaryInputs: auxiliary })
            }
          />
        );
      case 5:
        return (
          <Step5OutputSelection
            selectedOutputType={formData.selectedOutputType || "RJ45"}
            selectedAuxiliary={formData.selectedAuxiliaryOutputs || {}}
            onOutputTypeChange={(output) =>
              updateFormData({ selectedOutputType: output })
            }
            onAuxiliaryChange={(auxiliary) =>
              updateFormData({ selectedAuxiliaryOutputs: auxiliary })
            }
          />
        );
      case 6:
        return (
          <Step6Configuration
            brand={formData.selectedBrand || "NovaStar"}
            onConfigChange={(config) =>
              updateFormData({
                [formData.selectedBrand === "Brompton"
                  ? "bromptonConfig"
                  : "novastarConfig"]: config,
              })
            }
          />
        );
      case 7:
        return (
          <Step7Results
            solutions={solutions}
            selectedSolution={selectedSolution}
            loading={loading}
            error={error}
            onSelectSolution={selectSolution}
            onSendEmail={sendConfigurationEmail}
            onSendQuote={sendQuoteRequest}
            screenData={screenData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="processor-wizard-overlay">
      <div className="processor-wizard-modal">
        <div className="processor-wizard-header">
          <h2>{t("processorWizard", "Processor Wizard")}</h2>
          <button
            className="processor-wizard-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="processor-wizard-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {t("step")} {currentStep} {t("of", "of")} 7
          </p>
        </div>

        <div className="processor-wizard-content">{renderStep()}</div>

        <div className="processor-wizard-footer">
          <button
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            {t("previous", "Previous")}
          </button>

          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={currentStep === 7 || loading}
          >
            {loading ? t("calculating", "Calculating...") : t("next", "Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessorWizard;
