import { useTranslation } from "react-i18next";
import type { ScreenData } from "../../../hooks/useProcessorWizard";

interface Step1Props {
  screenData: ScreenData;
}

const Step1ScreenConfirmation: React.FC<Step1Props> = ({ screenData }) => {
  const { t } = useTranslation();

  return (
    <div className="step-content">
      <h3>{t("screenConfirmation", "Screen Confirmation")}</h3>
      <div className="step-info">
        <p>
          {t(
            "pleaseConfirmYourScreenSpecs",
            "Please confirm your screen specifications:",
          )}
        </p>

        <div className="specs-grid">
          <div className="spec-item">
            <label>{t("resolution", "Resolution")}</label>
            <p>
              {screenData.width} × {screenData.height} px
            </p>
          </div>

          <div className="spec-item">
            <label>{t("physicalDimensions", "Physical Dimensions")}</label>
            <p>
              {screenData.physicalWidth.toFixed(2)} ×{" "}
              {screenData.physicalHeight.toFixed(2)} m
            </p>
          </div>

          <div className="spec-item">
            <label>{t("totalPixels", "Total Pixels")}</label>
            <p>{(screenData.width * screenData.height).toLocaleString()}</p>
          </div>

          <div className="spec-item">
            <label>{t("pixelPitch", "Pixel Pitch")}</label>
            <p>{(screenData.pixelPitch || 6.25).toFixed(2)} mm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1ScreenConfirmation;
