import { useTranslation } from "react-i18next";

interface Step4Props {
  selectedMainInput: string;
  selectedAuxiliary: Record<string, number>;
  onMainInputChange: (input: string) => void;
  onAuxiliaryChange: (auxiliary: Record<string, number>) => void;
}

const MAIN_INPUTS = [
  { id: "HDMI-1.3", label: "HDMI 1.3", spec: "HDMI 1.3 input", icon: "/src/assets/connectors/HDMI_1-3.png" },
  { id: "HDMI-1.4", label: "HDMI 1.4", spec: "HDMI 1.4 input", icon: "/src/assets/connectors/HDMI_1-4.png" },
  { id: "HDMI-2.0", label: "HDMI 2.0", spec: "HDMI 2.0 input", icon: "/src/assets/connectors/HDMI_2-0.png" },
  { id: "HDMI-2.1", label: "HDMI 2.1", spec: "8K @60Hz, 48 Gbps", icon: "/src/assets/connectors/HDMI_2-1.png" },
  { id: "DP-1.1", label: "DP 1.1", spec: "DisplayPort 1.1 input", icon: "/src/assets/connectors/DP_1-1.png" },
  { id: "DP-1.2", label: "DP 1.2", spec: "DisplayPort 1.2 input", icon: "/src/assets/connectors/DP_1-2.png" },
  { id: "DP-1.4", label: "DP 1.4", spec: "DisplayPort 1.4 input", icon: "/src/assets/connectors/DP_1-4.png" },
  { id: "SDI-12G", label: "12G-SDI", spec: "12G-SDI input", icon: "/src/assets/connectors/12G_SDI.png" },
  { id: "SDI-3G", label: "3G-SDI", spec: "3G-SDI input", icon: "/src/assets/connectors/3G_SDI.png" },
  { id: "DVI", label: "DVI", spec: "DVI input", icon: "/src/assets/connectors/DVI.png" },
];

const AUXILIARY_INPUTS = [
  { id: "ScalerInput", label: "Scaler Input" },
  { id: "BackupInput", label: "Backup Input" },
];

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
      <div className="step-section">
        <h3>{t("selectInputConnector", "Select your main input connector")}</h3>
        <p className="section-description">
          {t("selectInputDesc", "Choose the primary connector type that will receive your main video signal")}
        </p>

        <div className="connectors-list">
          {MAIN_INPUTS.map((input) => (
            <button
              key={input.id}
              className={`connector-item ${selectedMainInput === input.id ? "active" : ""}`}
              onClick={() => onMainInputChange(input.id)}
              type="button"
            >
              <div className="connector-icon">
                <img src={input.icon} alt={input.label} />
              </div>
              <div className="connector-info">
                <span className="connector-label">{input.label}</span>
                <span className="connector-spec">{input.spec}</span>
              </div>
              {selectedMainInput === input.id && (
                <span className="connector-checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="step-divider"></div>

      <div className="step-section">
        <h3>{t("auxiliaryInputs", "Auxiliary Inputs")}</h3>
        <p className="section-description">
          {t("selectAddInputDesc", "Select additional input connectors for specific sources (cameras, computers, etc.)")}
        </p>

        <div className="auxiliary-inputs">
          {AUXILIARY_INPUTS.map((input) => (
            <label key={input.id} className="auxiliary-checkbox">
              <input
                type="checkbox"
                checked={!!selectedAuxiliary[input.id]}
                onChange={() => toggleAuxiliary(input.id)}
              />
              <span>{input.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4InputSelection;
