import { useTranslation } from "react-i18next";

interface Step6Props {
  brand: "NovaStar" | "Brompton";
  onConfigChange: (config: any) => void;
}

const Step6Configuration: React.FC<Step6Props> = ({
  brand,
  onConfigChange,
}) => {
  const { t } = useTranslation();

  if (brand === "Brompton") {
    return (
      <div className="step-content">
        <h3>{t("bromptonConfiguration", "Brompton Configuration")}</h3>

        <div className="config-section">
          <label>
            <span>{t("frameRate", "Frame Rate")}: </span>
            <select
              onChange={(e) =>
                onConfigChange({ frameRate: parseInt(e.target.value) })
              }
            >
              <option value={60}>60 Hz</option>
              <option value={120}>120 Hz</option>
              <option value={240}>240 Hz</option>
            </select>
          </label>

          <label>
            <span>{t("bitDepth", "Bit Depth")}: </span>
            <select
              onChange={(e) =>
                onConfigChange({ bitDepth: parseInt(e.target.value) })
              }
            >
              <option value={8}>8-bit</option>
              <option value={10}>10-bit</option>
              <option value={12}>12-bit</option>
            </select>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              onChange={(e) => onConfigChange({ ull: e.target.checked })}
            />
            <span>{t("ultraLowLatency", "Ultra-Low Latency (ULL)")}</span>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              onChange={(e) => onConfigChange({ failover: e.target.checked })}
            />
            <span>{t("failover", "Failover")}</span>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              onChange={(e) => onConfigChange({ redundant: e.target.checked })}
            />
            <span>{t("redundancy", "Redundancy")}</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content">
      <h3>{t("novastarConfiguration", "NovaStar Configuration")}</h3>

      <div className="config-section">
        <label>
          <span>{t("outputResolution", "Output Resolution")}: </span>
          <select
            onChange={(e) =>
              onConfigChange({ outputResolution: e.target.value })
            }
          >
            <option value="1080p">1080p</option>
            <option value="2K">2K</option>
            <option value="4K">4K</option>
          </select>
        </label>

        <label>
          <span>{t("colorDepth", "Color Depth")}: </span>
          <select
            onChange={(e) =>
              onConfigChange({ colorDepth: parseInt(e.target.value) })
            }
          >
            <option value={8}>8-bit</option>
            <option value={10}>10-bit</option>
            <option value={12}>12-bit</option>
          </select>
        </label>

        <label>
          <span>{t("refreshRate", "Refresh Rate")}: </span>
          <select
            onChange={(e) =>
              onConfigChange({ refreshRate: parseInt(e.target.value) })
            }
          >
            <option value={50}>50 Hz</option>
            <option value={60}>60 Hz</option>
          </select>
        </label>

        <label>
          <span>{t("syncMode", "Sync Mode")}: </span>
          <select
            onChange={(e) => onConfigChange({ syncMode: e.target.value })}
          >
            <option value="free-run">Free-run</option>
            <option value="sync-to-input">Sync to Input</option>
            <option value="locked">Locked</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Step6Configuration;
