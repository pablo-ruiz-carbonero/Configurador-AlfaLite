import type { Product } from "../../types/product";
import type { Stats } from "../../utils/calculateStats";

interface ResultsDataProps {
  product: Product;
  stats: Stats;
}

import { useTranslation } from "react-i18next";

interface ResultsDataProps {
  product: Product;
  stats: Stats;
}

function ResultsData({ product, stats }: ResultsDataProps) {
  const { t } = useTranslation();
  const u = stats.dimUnit;

  return (
    <div className="results-table">
      <div className="result-row">
        <span>{t("resultProduct")}</span>
        <strong>{product.name}</strong>
      </div>
      <div className="result-row">
        <span>{t("resultResolution")}</span>
        <strong>
          {stats.resH} x {stats.resV} px
        </strong>
      </div>
      <div className="result-row">
        <span>{t("resultDimensions")}</span>
        <strong>
          {stats.widthM.toFixed(2)} x {stats.heightM.toFixed(2)} x{" "}
          {stats.depth.toFixed(2)} {u}
        </strong>
      </div>
      <div className="result-row">
        <span>Diagonal:</span>
        <strong>
          {stats.diagonal.toFixed(2)} {u}
        </strong>
      </div>
      <div className="result-row">
        <span>{t("resultAspectRatio")}</span>
        <strong>{stats.aspect}</strong>
      </div>
      <div className="result-row">
        <span>{t("resultSurface")}</span>
        <strong>
          {stats.surface.toFixed(2)} {stats.surfaceUnit}
        </strong>
      </div>
      <div className="result-row">
        <span>{t("resultMaxPower")}</span>
        <strong>{stats.powerMax.toFixed(2)} kW</strong>
      </div>
      <div className="result-row">
        <span>{t("resultAvgPower")}</span>
        <strong>{stats.powerAvg.toFixed(2)} kW</strong>
      </div>
      <div className="result-row">
        <span>{t("resultWeight")}</span>
        <strong>{stats.weight.toFixed(2)} kg</strong>
      </div>
      <div className="result-row">
        <span>{t("resultOptViewDistance")}</span>
        <strong>
          &gt;{stats.optViewDistance.toFixed(2)} {u}
        </strong>
      </div>
      <div className="result-row">
        <span>{t("resultBrightness")}</span>
        <strong>{product.brightness ?? 0} cd/m2</strong>
      </div>
      <div className="result-row">
        <span>{t("resultTotalTiles")}</span>
        <strong>{stats.totalTiles}</strong>
      </div>
    </div>
  );
}

export default ResultsData;
