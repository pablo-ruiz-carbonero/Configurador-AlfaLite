import { useTranslation } from "react-i18next";

interface Step3Props {
  selectedApplications: string[];
  selectedBitDepth?: string;
  onApplicationsChange: (apps: string[]) => void;
  onBitDepthChange?: (depth: string) => void;
}

const APPLICATIONS = ["Corporate", "Retail"];
const BIT_DEPTHS = ["8-bit", "10-bit", "12-bit"];

const Step3ApplicationSelection: React.FC<Step3Props> = ({
  selectedApplications,
  selectedBitDepth = "8-bit",
  onApplicationsChange,
  onBitDepthChange,
}) => {
  const { t } = useTranslation();

  const toggleApplication = (app: string) => {
    const updated = selectedApplications.includes(app)
      ? selectedApplications.filter((a) => a !== app)
      : [...selectedApplications, app];
    onApplicationsChange(updated);
  };

  const handleBitDepthChange = (depth: string) => {
    onBitDepthChange?.(depth);
  };

  return (
    <div className="step-content">
      <div className="step-section">
        <h3>{t("selectApplications", "Select the Application(s)")}</h3>
        <p className="section-description">
          {t("selectApplicationDesc", "Choose the primary use case for your LED screen")}
        </p>

        <div className="applications-buttons">
          {APPLICATIONS.map((app) => (
            <button
              key={app}
              className={`app-button ${selectedApplications.includes(app) ? "active" : ""}`}
              onClick={() => toggleApplication(app)}
              type="button"
            >
              <span className="button-label">{app}</span>
              {selectedApplications.includes(app) && (
                <span className="checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="step-divider"></div>

      <div className="step-section">
        <h3>{t("bitDepthConfig", "Bit Depth Configuration")}</h3>
        <p className="section-description">
          {t("bitDepthDesc", "Select the color depth for your display")}
        </p>

        <div className="bit-depth-buttons">
          {BIT_DEPTHS.map((depth) => (
            <button
              key={depth}
              className={`depth-button ${selectedBitDepth === depth ? "active" : ""}`}
              onClick={() => handleBitDepthChange(depth)}
              type="button"
            >
              {depth}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step3ApplicationSelection;
