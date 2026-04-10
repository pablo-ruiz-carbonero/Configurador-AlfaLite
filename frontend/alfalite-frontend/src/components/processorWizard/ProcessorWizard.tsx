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
import Step8Error from "./steps/Step8Error";
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
    selectedBitDepth: "8-bit",
    selectedMainInputType: "HDMI-2.0",
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

  const isBrompton = formData.selectedBrand === "Brompton";
  const totalSteps = isBrompton ? 4 : 7;
  const resultsStep = isBrompton ? 4 : 7;
  const isResultsPage = isBrompton ? currentStep === 4 : currentStep === 7;

  const handleNext = async () => {
    const shouldCalculate =
      (isBrompton && currentStep === 3) || (!isBrompton && currentStep === 6);

    if (shouldCalculate) {
      try {
        await calculateSolutions(formData as CalculationRequest);
        setCurrentStep(resultsStep);
      } catch (err) {
        console.error("Error calculating solutions:", err);
        setCurrentStep(8);
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
        return isBrompton ? (
          <Step6Configuration
            brand="Brompton"
            onConfigChange={(config) =>
              updateFormData({ bromptonConfig: config })
            }
          />
        ) : (
          <Step3ApplicationSelection
            selectedApplications={formData.selectedApplications || []}
            selectedBitDepth={formData.selectedBitDepth || "8-bit"}
            onApplicationsChange={(apps) =>
              updateFormData({ selectedApplications: apps })
            }
            onBitDepthChange={(depth) =>
              updateFormData({ selectedBitDepth: depth })
            }
          />
        );
      case 4:
        return isBrompton ? (
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
        ) : (
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
              updateFormData({ novastarConfig: config })
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
      case 8:
        return (
          <Step8Error
            brand={formData.selectedBrand || "NovaStar"}
            errorMessage={
              error ||
              t(
                "noSolutionsFound",
                "No compatible processor solutions found for your configuration."
              )
            }
            onRetry={() => setCurrentStep(isBrompton ? 3 : 6)}
            onStartOver={() => {
              setCurrentStep(1);
              setFormData({
                screenData,
                selectedBrand: "NovaStar",
                selectedApplications: [],
                selectedBitDepth: "8-bit",
                selectedMainInputType: "HDMI-2.0",
                selectedAuxiliaryInputs: {},
                selectedOutputType: "RJ45",
                selectedAuxiliaryOutputs: {},
              });
            }}
            onClose={onClose}
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
              style={{ width: `${(Math.min(currentStep, totalSteps) / totalSteps) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {t("step")} {Math.min(currentStep, totalSteps)} {t("of", "of")} {totalSteps}
          </p>
        </div>

        <div className="processor-wizard-content">{renderStep()}</div>

        <div className="processor-wizard-footer">
          <button
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1 || currentStep === 8}
          >
            {t("previous", "Previous")}
          </button>

          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={isResultsPage || currentStep === 8 || loading}
          >
            {loading ? t("calculating", "Calculating...") : t("next", "Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessorWizard;
