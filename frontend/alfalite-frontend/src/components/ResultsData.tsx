// filepath: frontend/alfalite-frontend/src/components/ResultsData.tsx
import type { Product } from "../hooks/useProducts";
import type { Unit } from "../utils/calculateStats";

interface ResultsDataProps {
  product: Product;
  stats: {
    resH: number;
    resV: number;
    widthM: number;
    heightM: number;
    diagonal?: number;
    aspect: string;
    area: number;
    powerMax: number;
    powerAvg: number;
    weight: number;
  };
  unit: Unit;
}

function ResultsData({ product, stats }: ResultsDataProps) {
  if (!product) return null;

  // Calcular diagonal si no se pasa
  const diagonal =
    stats.diagonal || Math.sqrt(stats.widthM ** 2 + stats.heightM ** 2);

  return (
    <div className="results-table">
      <div className="result-row">
        <span>Product:</span> <strong>{product.name}</strong>
      </div>
      <div className="result-row">
        <span>Resolution:</span>{" "}
        <strong>
          {stats.resH} x {stats.resV} px
        </strong>
      </div>
      <div className="result-row">
        <span>Dimensions:</span>{" "}
        <strong>
          {stats.widthM.toFixed(2)} x {stats.heightM.toFixed(2)} x{" "}
          {product.depth?.toFixed(2) || 0} m
        </strong>
      </div>
      <div className="result-row">
        <span>Diagonal:</span> <strong>{diagonal.toFixed(2)} m</strong>
      </div>
      <div className="result-row">
        <span>Aspect ratio:</span> <strong>{stats.aspect}</strong>
      </div>
      <div className="result-row">
        <span>Surface:</span> <strong>{stats.area.toFixed(2)} m²</strong>
      </div>
      <div className="result-row">
        <span>Max. power consumption:</span>{" "}
        <strong>{stats.powerMax.toFixed(2)} kW</strong>
      </div>
      <div className="result-row">
        <span>Avg. power consumption:</span>{" "}
        <strong>{stats.powerAvg.toFixed(2)} kW</strong>
      </div>
      <div className="result-row">
        <span>Weight:</span> <strong>{stats.weight.toFixed(2)} kg</strong>
      </div>
      <div className="result-row">
        <span>Opt. view distance:</span>{" "}
        <strong>{product.opticalMultilayerInjection || ">4.62"} m</strong>
      </div>
      <div className="result-row">
        <span>Brightness:</span>{" "}
        <strong>{product.brightness || 0} cd/m²</strong>
      </div>
      <div className="result-row">
        <span>Total tiles:</span>{" "}
        <strong>{stats.resH && stats.resV ? 1 : 0}</strong>
      </div>
    </div>
  );
}

export default ResultsData;
