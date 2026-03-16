import type { Product } from "../../types/product";
import type { Stats } from "../../utils/calculateStats";

interface ResultsDataProps {
  product: Product;
  stats: Stats;
}

function ResultsData({ product, stats }: ResultsDataProps) {
  const u = stats.dimUnit;

  return (
    <div className="results-table">
      <div className="result-row">
        <span>Product:</span>
        <strong>{product.name}</strong>
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
        <span>Aspect ratio:</span>
        <strong>{stats.aspect}</strong>
      </div>
      <div className="result-row">
        <span>Surface:</span>
        <strong>
          {stats.surface.toFixed(2)} {stats.surfaceUnit}
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
          &gt;{stats.optViewDistance.toFixed(2)} {u}
        </strong>
      </div>
      <div className="result-row">
        <span>Brightness:</span>
        <strong>{product.brightness ?? 0} cd/m2</strong>
      </div>
      <div className="result-row">
        <span>Total tiles:</span>
        <strong>{stats.totalTiles}</strong>
      </div>
    </div>
  );
}

export default ResultsData;
