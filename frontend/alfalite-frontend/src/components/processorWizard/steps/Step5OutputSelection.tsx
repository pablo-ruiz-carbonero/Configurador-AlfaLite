import { useTranslation } from "react-i18next";

interface Step5Props {
  selectedOutputType: string;
  selectedAuxiliary: Record<string, number>;
  onOutputTypeChange: (output: string) => void;
  onAuxiliaryChange: (auxiliary: Record<string, number>) => void;
}

const MAIN_OUTPUTS = [
  { id: "RJ45", label: "RJ45 (Ethernet)", spec: "Direct connection to LED screen", icon: "/src/assets/connectors/RJ45.png" },
  { id: "OpticalFiber", label: "Fiber Optic", spec: "High-speed fiber connection with converters", icon: "/src/assets/connectors/OPT.png" },
  { id: "SDI", label: "SDI", spec: "SDI output for broadcast", icon: "/src/assets/connectors/3G_SDI.png" },
  { id: "DVI-D", label: "DVI-D", spec: "DVI-D input", icon: "/src/assets/connectors/DVI.png" },
  { id: "VGA", label: "VGA", spec: "2K @60Hz, 7.92 Gbps", icon: "/src/assets/connectors/VGA.png" },
  { id: "CVBS", label: "CVBS", spec: "Composite video", icon: "/src/assets/connectors/CVBS.png" },
  { id: "USB-3.0", label: "USB 3.0", spec: "4K @60Hz, 5 Gbps" },
  { id: "USB-2.0", label: "USB 2.0", spec: "7K @60Hz, 9.49 Gbps" },
];

const AUXILIARY_OUTPUTS = [
  { id: "Backup", label: "Backup Output" },
  { id: "Monitoring", label: "Monitoring Output" },
];

const Step5OutputSelection: React.FC<Step5Props> = ({
  selectedOutputType,
  selectedAuxiliary,
  onOutputTypeChange,
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
        <h3>{t("selectOutputConnector", "Select the output connector type for your LED screen")}</h3>
        <p className="section-description">
          {t("selectOutputDesc", "This determines how the processor connects to your LED screen")}
        </p>

        <div className="connectors-list">
          {MAIN_OUTPUTS.map((output) => (
            <button
              key={output.id}
              className={`connector-item ${selectedOutputType === output.id ? "active" : ""}`}
              onClick={() => onOutputTypeChange(output.id)}
              type="button"
            >
              {output.icon && (
                <div className="connector-icon">
                  <img src={output.icon} alt={output.label} />
                </div>
              )}
              <div className="connector-info">
                <span className="connector-label">{output.label}</span>
                <span className="connector-spec">{output.spec}</span>
              </div>
              {selectedOutputType === output.id && (
                <span className="connector-checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="step-divider"></div>

      <div className="step-section">
        <h3>{t("auxiliaryOutputs", "Auxiliary Outputs")}</h3>
        <p className="section-description">
          {t("selectAddOutputDesc", "Select additional outputs for management monitors, preview displays, recording, etc.")}
        </p>

        <div className="auxiliary-outputs">
          {AUXILIARY_OUTPUTS.map((output) => (
            <label key={output.id} className="auxiliary-checkbox">
              <input
                type="checkbox"
                checked={!!selectedAuxiliary[output.id]}
                onChange={() => toggleAuxiliary(output.id)}
              />
              <span>{output.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step5OutputSelection;
