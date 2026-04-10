import type { Product } from "../../types/product";
import type { Stats } from "../../utils/calculateStats";
import { useTranslation } from "react-i18next";
import "./css/ResultsData.css";

interface ResultsDataProps {
  product: Product;
  stats: Stats;
  stats2?: Stats | null;
  compareMode?: boolean;
  onCopyScreen2?: () => void;
  copyStatus2?: "idle" | "copied" | "failed";
}

function ResultsData({ product, stats, stats2 }: ResultsDataProps) {
  const { t, i18n } = useTranslation();

  const localeMap: Record<string, string> = {
    es: "es-ES",
    en: "en-US",
  };

  const locale = localeMap[i18n.language] || "en-US";

  const resultRows = [
    { key: "product", label: t("resultProduct"), value: () => product.name },
    {
      key: "resolution",
      label: t("resultResolution"),
      value: (s: Stats) => `${s.resH} x ${s.resV} px`,
    },
    {
      key: "dimensions",
      label: t("resultDimensions"),
      value: (s: Stats) =>
        `${s.widthM.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x ${s.heightM.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x ${s.depth.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${s.dimUnit}`,
    },
    {
      key: "diagonal",
      label: t("resultDiagonal") ?? "Diagonal:",
      value: (s: Stats) =>
        `${s.diagonal.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${s.dimUnit}`,
    },
    {
      key: "aspect",
      label: t("resultAspectRatio"),
      value: (s: Stats) => s.aspect,
    },
    {
      key: "surface",
      label: t("resultSurface"),
      value: (s: Stats) =>
        `${s.surface.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${s.surfaceUnit}`,
    },
    {
      key: "maxPower",
      label: t("resultMaxPower"),
      value: (s: Stats) =>
        `${s.powerMax.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`,
    },
    {
      key: "avgPower",
      label: t("resultAvgPower"),
      value: (s: Stats) =>
        `${s.powerAvg.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`,
    },
    {
      key: "weight",
      label: t("resultWeight"),
      value: (s: Stats) =>
        `${s.weight.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg`,
    },
    {
      key: "optViewDistance",
      label: t("resultOptViewDistance"),
      value: (s: Stats) =>
        `>${s.optViewDistance.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${s.dimUnit}`,
    },
    {
      key: "brightness",
      label: t("resultBrightness"),
      value: () => `${product.brightness ?? 0} cd/m2`,
    },
    {
      key: "totalTiles",
      label: t("resultTotalTiles"),
      value: (s: Stats) => `${s.totalTiles}`,
    },
  ];

  const hasCompare = Boolean(stats2);

  return (
    <div
      className={
        hasCompare ? "results-table results-table-compare" : "results-table"
      }
    >
      {hasCompare ? (
        <>
          <div className="result-row result-row-header">
            <span></span>
            <strong>{t("screenA")}</strong>
            <strong>{t("screenB")}</strong>
          </div>
          {resultRows.map((row) => (
            <div key={row.key} className="result-row result-row-compare">
              <span>{row.label}</span>
              <strong>{row.value(stats)}</strong>
              <strong>{stats2 ? row.value(stats2) : "-"}</strong>
            </div>
          ))}
        </>
      ) : (
        resultRows.map((row) => (
          <div key={row.key} className="result-row">
            <span>{row.label}</span>
            <strong>{row.value(stats)}</strong>
          </div>
        ))
      )}
    </div>
  );
}

export default ResultsData;
