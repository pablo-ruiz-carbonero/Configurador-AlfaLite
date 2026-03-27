import { useTranslation } from "react-i18next";

interface Step4Props {
  selectedMainInput: string;
  selectedAuxiliary: Record<string, number>;
  onMainInputChange: (input: string) => void;
  onAuxiliaryChange: (auxiliary: Record<string, number>) => void;
}

const INPUT_TYPES = ["HDMI", "DisplayPort", "Fiber"];

const Step4InputSelection: React.FC<Step4Props> = ({
  selectedMainInput,
  selectedAuxiliary,
  onMainInputChange,
  onAuxiliaryChange,
}) => {
  const { t } = useTranslation();

  const toggleAuxiliary = (key: string) => {
    const updated = { ...selectedAuxiliary };
    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = 1;
    }
    onAuxiliaryChange(updated);
  };

  return (
    <div className="step-content">
      <h3>{t("selectInputConnectors", "Select Input Connectors")}</h3>

      <div className="input-section">
        <h4>{t("mainInput", "Main Input")}</h4>
        <div className="input-options">
          {INPUT_TYPES.map((input) => (
            <label key={input} className="input-radio">
              <input
                type="radio"
                name="mainInput"
                value={input}
                checked={selectedMainInput === input}
                onChange={() => onMainInputChange(input)}
              />
              <span>{input}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="input-section">
        <h4>{t("auxiliaryInputs", "Auxiliary Inputs (Optional)")}</h4>
        <label className="input-checkbox">
          <input
            type="checkbox"
            checked={!!selectedAuxiliary["ScalerInput"]}
            onChange={() => toggleAuxiliary("ScalerInput")}
          />
          <span>{t("scalerInput", "Scaler Input")}</span>
        </label>

        <label className="input-checkbox">
          <input
            type="checkbox"
            checked={!!selectedAuxiliary["BackupInput"]}
            onChange={() => toggleAuxiliary("BackupInput")}
          />
          <span>{t("backupInput", "Backup Input")}</span>
        </label>
      </div>
    </div>
  );
};

export default Step4InputSelection;
