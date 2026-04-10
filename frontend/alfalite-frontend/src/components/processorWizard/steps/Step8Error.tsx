import { useTranslation } from "react-i18next";

interface Step8ErrorProps {
  brand: "NovaStar" | "Brompton";
  errorMessage: string;
  onRetry: () => void;
  onStartOver: () => void;
  onClose: () => void;
}

const Step8Error: React.FC<Step8ErrorProps> = ({
  brand,
  errorMessage,
  onRetry,
  onStartOver,
  onClose,
}) => {
  const { t } = useTranslation();

  const getErrorTitle = () => {
    if (brand === "Brompton") {
      return t("bromptonConfigError", "Brompton Configuration Error");
    }
    return t("novastarConfigError", "NovaStar Configuration Error");
  };

  const getErrorDescription = () => {
    if (brand === "Brompton") {
      return t(
        "bromptonErrorDesc",
        "The selected Brompton configuration is not compatible with your requirements. This may be due to incompatible frame rates, bit depths, or feature combinations."
      );
    }
    return t(
      "novastarErrorDesc",
      "The selected NovaStar configuration is not compatible with your requirements. This may be due to incompatible resolutions, color depths, or sync settings."
    );
  };

  const getSuggestions = () => {
    if (brand === "Brompton") {
      return [
        t("bromptonSuggestion1", "Try reducing the frame rate to 60Hz"),
        t("bromptonSuggestion2", "Use 8-bit or 10-bit depth instead of 12-bit"),
        t("bromptonSuggestion3", "Disable Ultra-Low Latency (ULL) feature"),
        t("bromptonSuggestion4", "Consider using NovaStar processor instead"),
      ];
    }
    return [
      t("novastarSuggestion1", "Try using 1080p or 2K resolution"),
      t("novastarSuggestion2", "Use 8-bit or 10-bit color depth"),
      t("novastarSuggestion3", "Set sync mode to 'Free-run'"),
      t("novastarSuggestion4", "Consider using Brompton processor instead"),
    ];
  };

  return (
    <div className="step-content error-step">
      <div className="error-header">
        <div className="error-icon-large">⚠️</div>
        <h2>{getErrorTitle()}</h2>
        <p className="error-description">{getErrorDescription()}</p>
      </div>

      <div className="error-details">
        <h3>{t("errorDetails", "Error Details")}</h3>
        <div className="error-message-box">
          <p>{errorMessage}</p>
        </div>
      </div>

      <div className="error-suggestions">
        <h3>{t("suggestedSolutions", "Suggested Solutions")}</h3>
        <ul className="suggestions-list">
          {getSuggestions().map((suggestion, index) => (
            <li key={index}>
              <span className="suggestion-icon">💡</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      <div className="error-actions">
        <div className="action-buttons">
          <button
            onClick={onRetry}
            className="btn-retry"
          >
            {t("retryConfiguration", "Retry Configuration")}
          </button>

          <button
            onClick={onStartOver}
            className="btn-start-over"
          >
            {t("startOver", "Start Over")}
          </button>
        </div>

        <button
          onClick={onClose}
          className="btn-close-wizard"
        >
          {t("closeWizard", "Close Wizard")}
        </button>
      </div>
    </div>
  );
};

export default Step8Error;