import { useTranslation } from "react-i18next";

interface Step2Props {
  selectedBrand: "NovaStar" | "Brompton";
  onBrandChange: (brand: "NovaStar" | "Brompton") => void;
}

const Step2BrandSelection: React.FC<Step2Props> = ({
  selectedBrand,
  onBrandChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="step-content">
      <h3>{t("selectBrand", "Select Processor Brand")}</h3>

      <div className="brand-options">
        <div
          className={`brand-card ${selectedBrand === "NovaStar" ? "selected" : ""}`}
          onClick={() => onBrandChange("NovaStar")}
        >
          <div className="brand-header">
            <h4>NovaStar</h4>
            <input
              type="radio"
              name="brand"
              value="NovaStar"
              checked={selectedBrand === "NovaStar"}
              onChange={() => onBrandChange("NovaStar")}
            />
          </div>
          <p>
            {t(
              "novastarDescription",
              "Professional-grade LED processors for broadcast and rental applications",
            )}
          </p>
          <ul className="features-list">
            <li>✓ 4K resolution support</li>
            <li>✓ Multiple input connectors</li>
            <li>✓ Flexible output options</li>
            <li>✓ Scalable solutions</li>
          </ul>
        </div>

        <div
          className={`brand-card ${selectedBrand === "Brompton" ? "selected" : ""}`}
          onClick={() => onBrandChange("Brompton")}
        >
          <div className="brand-header">
            <h4>Brompton</h4>
            <input
              type="radio"
              name="brand"
              value="Brompton"
              checked={selectedBrand === "Brompton"}
              onChange={() => onBrandChange("Brompton")}
            />
          </div>
          <p>
            {t(
              "bromPtonDescription",
              "High-performance processors with advanced features for critical applications",
            )}
          </p>
          <ul className="features-list">
            <li>✓ Ultra-Low Latency (ULL)</li>
            <li>✓ HDR support</li>
            <li>✓ Redundancy options</li>
            <li>✓ High frame rates (up to 240 Hz)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step2BrandSelection;
