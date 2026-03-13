// filepath: src/components/ResultsData.tsx
import type { Product } from "../hooks/useProducts";
import type { Stats, Unit } from "../utils/calculateStats";

interface ResultsDataProps {
  product: Product;
  stats: Stats;
  unit: Unit;
}

function ResultsData({ product, stats, unit }: ResultsDataProps) {
  const unitLabel = unit === "m" ? "m" : "ft";
  const surfaceLabel = unit === "m" ? "m²" : "ft²";

  // convertir depth de mm a unidad actual
  const depth =
    product.depth !== undefined
      ? (product.depth / 1000) * (unit === "ft" ? 3.28084 : 1)
      : 0;

  // convertir aspect 1.00 -> 1 : 1
  const aspectParts = stats.aspect.split(".");
  const aspectFormatted =
    aspectParts.length === 2
      ? `${aspectParts[0]} : ${aspectParts[0]}`
      : stats.aspect;

  return (
    <div className="results-table">
      <div className="result-row">
        <span>Product:</span>
        <strong>*{product.name}</strong>
      </div>

      <div className="result-row">
        <span>Resolution:</span>
        <strong>
          {stats.resH} x {stats.resV} px
        </strong>
      </div>

      <div className="result-row">
        <span>Dimensions:</span>
        <strong>
          {stats.widthM.toFixed(2)} x {stats.heightM.toFixed(2)} x{" "}
          {depth.toFixed(2)} {unitLabel}
        </strong>
      </div>

      <div className="result-row">
        <span>Diagonal:</span>
        <strong>
          {stats.diagonal.toFixed(2)} {unitLabel}
        </strong>
      </div>

      <div className="result-row">
        <span>Aspect ratio:</span>
        <strong>{aspectFormatted}</strong>
      </div>

      <div className="result-row">
        <span>Surface:</span>
        <strong>
          {stats.area.toFixed(2)} {surfaceLabel}
        </strong>
      </div>

      <div className="result-row">
        <span>Max. power consumption:</span>
        <strong>{stats.powerMax.toFixed(2)} kW</strong>
      </div>

      <div className="result-row">
        <span>Avg. power consumption:</span>
        <strong>{stats.powerAvg.toFixed(2)} kW</strong>
      </div>

      <div className="result-row">
        <span>Weight:</span>
        <strong>{stats.weight.toFixed(2)} kg</strong>
      </div>

      <div className="result-row">
        <span>Opt. view distance:</span>
        <strong>
          {product.opticalMultilayerInjection ?? ">4.62"} {unitLabel}
        </strong>
      </div>

      <div className="result-row">
        <span>Brightness:</span>
        <strong>{product.brightness ?? 0} cd/m²</strong>
      </div>

      <div className="result-row">
        <span>Total tiles:</span>
        <strong>{stats.totalTiles}</strong>
      </div>
    </div>
  );
}

export default ResultsData;
