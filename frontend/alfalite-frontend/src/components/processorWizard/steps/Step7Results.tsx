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
        <p>
          {t("calculatingRecommendations", "Calculating recommendations...")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="step-content error">
        <p>
          {t("error")}: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="step-content results">
      <h3>{t("recommendedSolutions", "Recommended Solutions")}</h3>

      <div className="solutions-list">
        {solutions.map((solution) => (
          <div
            key={solution.id}
            className={`solution-card ${selectedSolution?.id === solution.id ? "selected" : ""}`}
            onClick={() => onSelectSolution(solution)}
          >
            <div className="solution-header">
              <h4>
                #{solution.rank} - {solution.summary}
              </h4>
              <span className="solution-cost">
                ${solution.totalCost.toLocaleString()}
              </span>
            </div>

            <div className="solution-details">
              <p className="solution-type">{solution.solutionType}</p>

              <div className="cost-breakdown">
                <p>
                  <strong>{t("processors", "Processors")}:</strong> $
                  {solution.costBreakdown.processors.toLocaleString()}
                </p>
                <p>
                  <strong>{t("inputCards", "Input Cards")}:</strong> $
                  {solution.costBreakdown.inputCards.toLocaleString()}
                </p>
                <p>
                  <strong>{t("outputCards", "Output Cards")}:</strong> $
                  {solution.costBreakdown.outputCards.toLocaleString()}
                </p>
              </div>

              <h5>{t("advantages", "Advantages")}:</h5>
              <ul>
                {solution.advantages.map((adv, i) => (
                  <li key={i}>{adv}</li>
                ))}
              </ul>

              <h5>{t("considerations", "Considerations")}:</h5>
              <ul>
                {solution.considerations.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {selectedSolution && (
        <div className="action-section">
          <h4>{t("sendConfiguration", "Send Configuration")}</h4>
          <div className="email-input-group">
            <input
              type="email"
              placeholder={t("enterEmailAddress", "Enter your email address")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendEmail}
              disabled={!email || sendingEmail}
              className="btn-primary"
            >
              {sendingEmail
                ? t("sending", "Sending...")
                : t("sendEmail", "Send Email")}
            </button>

            <button
              onClick={handleSendQuote}
              disabled={!email || sendingEmail}
              className="btn-secondary"
            >
              {sendingEmail
                ? t("sending", "Sending...")
                : t("requestQuote", "Request Quote")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step7Results;
