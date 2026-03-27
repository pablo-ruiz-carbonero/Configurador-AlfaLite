import { useTranslation } from "react-i18next";

interface Step5Props {
  selectedOutputType: "RJ45" | "OpticalFiber";
  selectedAuxiliary: Record<string, number>;
  onOutputTypeChange: (output: "RJ45" | "OpticalFiber") => void;
  onAuxiliaryChange: (auxiliary: Record<string, number>) => void;
}

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
      <h3>{t("selectOutputConnectors", "Select Output Connectors")}</h3>

      <div className="output-section">
        <h4>{t("mainOutput", "Main Output Type")}</h4>
        <div className="output-options">
          <label className="output-radio">
            <input
              type="radio"
              name="output"
              value="RJ45"
              checked={selectedOutputType === "RJ45"}
              onChange={() => onOutputTypeChange("RJ45")}
            />
            <span>RJ45 Ethernet</span>
            <small>Standard cabling, up to 100m distance</small>
          </label>

          <label className="output-radio">
            <input
              type="radio"
              name="output"
              value="OpticalFiber"
              checked={selectedOutputType === "OpticalFiber"}
              onChange={() => onOutputTypeChange("OpticalFiber")}
            />
            <span>Optical Fiber</span>
            <small>Long distance, up to 2km</small>
          </label>
        </div>
      </div>

      <div className="output-section">
        <h4>{t("auxiliaryOutputs", "Auxiliary Outputs (Optional)")}</h4>

        <label className="output-checkbox">
          <input
            type="checkbox"
            checked={!!selectedAuxiliary["Backup"]}
            onChange={() => toggleAuxiliary("Backup")}
          />
          <span>{t("backupOutput", "Backup Output")}</span>
        </label>

        <label className="output-checkbox">
          <input
            type="checkbox"
            checked={!!selectedAuxiliary["Monitoring"]}
            onChange={() => toggleAuxiliary("Monitoring")}
          />
          <span>{t("monitoringOutput", "Monitoring Output")}</span>
        </label>
      </div>
    </div>
  );
};

export default Step5OutputSelection;
