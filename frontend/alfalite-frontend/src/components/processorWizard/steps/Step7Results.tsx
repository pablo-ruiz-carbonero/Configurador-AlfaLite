import { useTranslation } from "react-i18next";
import { useState } from "react";
import type {
  ConfigurationSolution,
  ScreenData,
} from "../../../hooks/useProcessorWizard";

interface Step7Props {
  solutions: ConfigurationSolution[];
  selectedSolution: ConfigurationSolution | null;
  loading: boolean;
  error: string | null;
  onSelectSolution: (solution: ConfigurationSolution) => void;
  onSendEmail: (email: string, screenSpecs: any) => Promise<any>;
  onSendQuote: (email: string, screenSpecs: any) => Promise<any>;
  screenData: ScreenData;
}

const Step7Results: React.FC<Step7Props> = ({
  solutions,
  selectedSolution,
  loading,
  error,
  onSelectSolution,
  onSendEmail,
  onSendQuote,
  screenData,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    if (!email || !selectedSolution) return;
    setSendingEmail(true);
    try {
      await onSendEmail(email, screenData);
      alert(t("emailSent", "Email sent successfully!"));
      setEmail("");
    } catch (err) {
      alert(t("emailFailed", "Failed to send email"));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendQuote = async () => {
    if (!email || !selectedSolution) return;
    setSendingEmail(true);
    try {
      await onSendQuote(email, screenData);
      alert(t("quoteRequestSent", "Quote request sent successfully!"));
      setEmail("");
    } catch (err) {
      alert(t("quoteRequestFailed", "Failed to send quote request"));
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="step-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>
            {t(
              "calculatingRecommendations",
              "Calculating recommendations..."
            )}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="step-content error-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>
            {t("error")}: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content results-container">
      <div className="results-header">
        <h2>{t("recommendedSolutions", "Recommended Solutions")}</h2>
        <p className="results-subtitle">
          {t(
            "selectBestSolution",
            "Choose the solution that best fits your needs"
          )}
        </p>
      </div>

      <div className="solutions-grid">
        {solutions.map((solution, index) => (
          <div
            key={solution.id}
            className={`solution-card ${
              selectedSolution?.id === solution.id ? "selected" : ""
            } ${index === 0 ? "recommended" : ""}`}
            onClick={() => onSelectSolution(solution)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSelectSolution(solution);
            }}
          >
            {index === 0 && (
              <div className="recommended-badge">
                ⭐ {t("recommended", "Recommended")}
              </div>
            )}

            <div className="card-header">
              <h3 className="solution-rank">#{solution.rank}</h3>
              <div className="cost-badge">
                ${solution.totalCost.toLocaleString()}
              </div>
            </div>

            <div className="card-title">
              <h4>{solution.summary}</h4>
              <p className="solution-type">{solution.solutionType}</p>
            </div>

            <div className="separator"></div>

            {/* Cost Breakdown */}
            <div className="cost-section">
              <h5>{t("costBreakdown", "Cost Breakdown")}</h5>
              <div className="cost-items">
                <div className="cost-item">
                  <span className="cost-label">
                    {t("processors", "Processors")}
                  </span>
                  <span className="cost-value">
                    ${solution.costBreakdown.processors.toLocaleString()}
                  </span>
                </div>
                <div className="cost-item">
                  <span className="cost-label">
                    {t("inputCards", "Input Cards")}
                  </span>
                  <span className="cost-value">
                    ${solution.costBreakdown.inputCards.toLocaleString()}
                  </span>
                </div>
                <div className="cost-item">
                  <span className="cost-label">
                    {t("outputCards", "Output Cards")}
                  </span>
                  <span className="cost-value">
                    ${solution.costBreakdown.outputCards.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Advantages */}
            <div className="advantages-section">
              <h5>✓ {t("advantages", "Advantages")}</h5>
              <ul className="benefits-list">
                {solution.advantages.map((adv, i) => (
                  <li key={i}>
                    <span className="checkmark">✓</span>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>

            {/* Considerations */}
            <div className="considerations-section">
              <h5>⚡ {t("considerations", "Considerations")}</h5>
              <ul className="considerations-list">
                {solution.considerations.map((con, i) => (
                  <li key={i}>
                    <span className="note-icon">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="select-button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectSolution(solution);
              }}
            >
              {selectedSolution?.id === solution.id
                ? t("selected", "Selected")
                : t("select", "Select")}
            </button>
          </div>
        ))}
      </div>

      {selectedSolution && (
        <div className="action-section">
          <div className="action-header">
            <h3>{t("sendConfiguration", "Send Configuration")}</h3>
            <p className="action-subtitle">
              {t(
                "shareYourConfiguration",
                "Share your configuration via email"
              )}
            </p>
          </div>

          <div className="email-section">
            <div className="email-input-group">
              <input
                type="email"
                placeholder={t(
                  "enterEmailAddress",
                  "Enter your email address"
                )}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
              />

              <div className="button-group">
                <button
                  onClick={handleSendEmail}
                  disabled={!email || sendingEmail}
                  className="btn-send-email"
                >
                  {sendingEmail
                    ? t("sending", "Sending...")
                    : t("sendEmail", "Send Email")}
                </button>

                <button
                  onClick={handleSendQuote}
                  disabled={!email || sendingEmail}
                  className="btn-request-quote"
                >
                  {sendingEmail
                    ? t("sending", "Sending...")
                    : t("requestQuote", "Request Quote")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step7Results;
