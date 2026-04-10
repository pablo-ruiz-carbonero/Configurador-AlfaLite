import { useTranslation } from "react-i18next";
import { useState } from "react";

interface Step6Props {
  brand: "NovaStar" | "Brompton";
  onConfigChange: (config: any) => void;
}

interface BromptonConfig {
  frameRate?: number;
  bitDepth?: number;
  ull?: boolean;
  failover?: boolean;
  redundant?: boolean;
}

interface NovastarConfig {
  outputResolution?: string;
  colorDepth?: number;
  refreshRate?: number;
  syncMode?: string;
}

const Step6Configuration: React.FC<Step6Props> = ({
  brand,
  onConfigChange,
}) => {
  const { t } = useTranslation();
  const [bromptonConfig, setBromptonConfig] = useState<BromptonConfig>({
    frameRate: 60,
    bitDepth: 8,
    ull: false,
    failover: false,
    redundant: false,
  });
  const [novastarConfig, setNovastarConfig] = useState<NovastarConfig>({
    outputResolution: "1080p",
    colorDepth: 8,
    refreshRate: 60,
    syncMode: "free-run",
  });

  const handleBromptonChange = (key: keyof BromptonConfig, value: any) => {
    const newConfig = { ...bromptonConfig, [key]: value };
    setBromptonConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleNovastarChange = (key: keyof NovastarConfig, value: any) => {
    const newConfig = { ...novastarConfig, [key]: value };
    setNovastarConfig(newConfig);
    onConfigChange(newConfig);
  };

  if (brand === "Brompton") {
    const frameRates = [
      { value: 60, label: "60 Hz", spec: "Standard frame rate" },
      { value: 120, label: "120 Hz", spec: "High refresh rate" },
      { value: 240, label: "240 Hz", spec: "Ultra-high refresh rate" },
    ];

    const bitDepths = [
      { value: 8, label: "8-bit", spec: "Standard depth" },
      { value: 10, label: "10-bit", spec: "Enhanced depth" },
      { value: 12, label: "12-bit", spec: "Maximum depth" },
    ];

    return (
      <div className="step-content">
        <h3>{t("bromptonConfiguration", "Brompton Configuration")}</h3>

        {/* Frame Rate Selection */}
        <div className="step-section">
          <p className="section-description">
            {t("selectFrameRate", "Select Frame Rate")}
          </p>
          <div className="buttons-grid">
            {frameRates.map((fr) => (
              <button
                key={fr.value}
                className={`connector-item ${
                  bromptonConfig.frameRate === fr.value ? "active" : ""
                }`}
                onClick={() => handleBromptonChange("frameRate", fr.value)}
              >
                <div className="connector-label">{fr.label}</div>
                <div className="connector-spec">{fr.spec}</div>
                {bromptonConfig.frameRate === fr.value && (
                  <div className="connector-checkmark">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="step-divider" />

        {/* Bit Depth Selection */}
        <div className="step-section">
          <p className="section-description">
            {t("selectBitDepth", "Select Bit Depth")}
          </p>
          <div className="buttons-grid">
            {bitDepths.map((bd) => (
              <button
                key={bd.value}
                className={`connector-item ${
                  bromptonConfig.bitDepth === bd.value ? "active" : ""
                }`}
                onClick={() => handleBromptonChange("bitDepth", bd.value)}
              >
                <div className="connector-label">{bd.label}</div>
                <div className="connector-spec">{bd.spec}</div>
                {bromptonConfig.bitDepth === bd.value && (
                  <div className="connector-checkmark">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="step-divider" />

        <div className="step-section estimate-card">
          <div className="estimate-header">
            <div className="estimate-title">Estimated Output Ports</div>
            <div className="estimate-value">4 RJ45 ports</div>
          </div>
          <div className="estimate-meta">
            {bromptonConfig.frameRate}Hz, {bromptonConfig.bitDepth}-bit
            final count calculated using panel distribution
          </div>
        </div>

        <div className="step-divider" />

        {/* Features */}
        <div className="step-section">
          <p className="section-description">
            {t("selectFeatures", "Select Features")}
          </p>
          <div className="features-list">
            <label className="feature-item">
              <input
                type="checkbox"
                checked={bromptonConfig.ull || false}
                onChange={(e) =>
                  handleBromptonChange("ull", e.target.checked)
                }
              />
              <span className="feature-label">
                {t("ultraLowLatency", "Ultra-Low Latency (ULL)")}
              </span>
              <span className="feature-spec">
                {t("ullDesc", "Real-time processing with minimal delay")}
              </span>
            </label>

            <label className="feature-item">
              <input
                type="checkbox"
                checked={bromptonConfig.failover || false}
                onChange={(e) =>
                  handleBromptonChange("failover", e.target.checked)
                }
              />
              <span className="feature-label">
                {t("failover", "Failover")}
              </span>
              <span className="feature-spec">
                {t("failoverDesc", "Automatic backup signal switching")}
              </span>
            </label>

            <label className="feature-item">
              <input
                type="checkbox"
                checked={bromptonConfig.redundant || false}
                onChange={(e) =>
                  handleBromptonChange("redundant", e.target.checked)
                }
              />
              <span className="feature-label">
                {t("redundancy", "Redundancy")}
              </span>
              <span className="feature-spec">
                {t("redundancyDesc", "Dual signal paths for reliability")}
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // NovaStar Configuration
  const resolutions = [
    { value: "1080p", label: "1080p", spec: "Full HD resolution" },
    { value: "2K", label: "2K", spec: "2K resolution" },
    { value: "4K", label: "4K", spec: "Ultra HD resolution" },
  ];

  const colorDepths = [
    { value: 8, label: "8-bit", spec: "Standard color depth" },
    { value: 10, label: "10-bit", spec: "Extended color range" },
    { value: 12, label: "12-bit", spec: "Cinema grade color" },
  ];

  const refreshRates = [
    { value: 50, label: "50 Hz", spec: "PAL standard" },
    { value: 60, label: "60 Hz", spec: "NTSC standard" },
  ];

  const syncModes = [
    { value: "free-run", label: "Free-run", spec: "Independent timing" },
    {
      value: "sync-to-input",
      label: "Sync to Input",
      spec: "Lock to input signal",
    },
    { value: "locked", label: "Locked", spec: "Locked to reference" },
  ];

  return (
    <div className="step-content">
      <h3>{t("novastarConfiguration", "NovaStar Configuration")}</h3>

      {/* Resolution Selection */}
      <div className="step-section">
        <p className="section-description">
          {t("selectOutputResolution", "Select Output Resolution")}
        </p>
        <div className="buttons-grid">
          {resolutions.map((res) => (
            <button
              key={res.value}
              className={`connector-item ${
                novastarConfig.outputResolution === res.value ? "active" : ""
              }`}
              onClick={() => handleNovastarChange("outputResolution", res.value)}
            >
              <div className="connector-label">{res.label}</div>
              <div className="connector-spec">{res.spec}</div>
              {novastarConfig.outputResolution === res.value && (
                <div className="connector-checkmark">✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="step-divider" />

      {/* Color Depth Selection */}
      <div className="step-section">
        <p className="section-description">
          {t("selectColorDepth", "Select Color Depth")}
        </p>
        <div className="buttons-grid">
          {colorDepths.map((cd) => (
            <button
              key={cd.value}
              className={`connector-item ${
                novastarConfig.colorDepth === cd.value ? "active" : ""
              }`}
              onClick={() => handleNovastarChange("colorDepth", cd.value)}
            >
              <div className="connector-label">{cd.label}</div>
              <div className="connector-spec">{cd.spec}</div>
              {novastarConfig.colorDepth === cd.value && (
                <div className="connector-checkmark">✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="step-divider" />

      {/* Refresh Rate Selection */}
      <div className="step-section">
        <p className="section-description">
          {t("selectRefreshRate", "Select Refresh Rate")}
        </p>
        <div className="buttons-grid">
          {refreshRates.map((rr) => (
            <button
              key={rr.value}
              className={`connector-item ${
                novastarConfig.refreshRate === rr.value ? "active" : ""
              }`}
              onClick={() => handleNovastarChange("refreshRate", rr.value)}
            >
              <div className="connector-label">{rr.label}</div>
              <div className="connector-spec">{rr.spec}</div>
              {novastarConfig.refreshRate === rr.value && (
                <div className="connector-checkmark">✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="step-divider" />

      {/* Sync Mode Selection */}
      <div className="step-section">
        <p className="section-description">
          {t("selectSyncMode", "Select Sync Mode")}
        </p>
        <div className="buttons-grid">
          {syncModes.map((sm) => (
            <button
              key={sm.value}
              className={`connector-item ${
                novastarConfig.syncMode === sm.value ? "active" : ""
              }`}
              onClick={() => handleNovastarChange("syncMode", sm.value)}
            >
              <div className="connector-label">{sm.label}</div>
              <div className="connector-spec">{sm.spec}</div>
              {novastarConfig.syncMode === sm.value && (
                <div className="connector-checkmark">✓</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step6Configuration;
