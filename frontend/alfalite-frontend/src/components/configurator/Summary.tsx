// src/components/configurator/Summary.tsx
import React from "react";

import { type Product } from "../../hooks/useProducts";

interface Props {
  totals: any;
  product?: Product | null;
}

const Summary: React.FC<Props> = ({ totals, product }) => {
  if (!totals) return null;

  return (
    <div className="config-summary glass-panel">
      {product && (
        <div className="summary-header">
          <strong>{product.name}</strong> - {product.pixelPitch}mm pitch
        </div>
      )}
      <div className="summary-item">
        <span className="label">Dimensiones Totales</span>
        <span className="value">
          {(totals.widthMm / 1000).toFixed(2)}m x{" "}
          {(totals.heightMm / 1000).toFixed(2)}m
        </span>
      </div>

      <div className="summary-item">
        <span className="label">Resolución Total</span>
        <span className="value">
          {totals.pixelsH} x {totals.pixelsV} px
        </span>
      </div>

      <div className="summary-item primary">
        <span className="label">Total Cabinets</span>
        <span className="value">{totals.totalCabinets}</span>
      </div>

      <div className="summary-grid">
        <div className="summary-mini">
          <span className="label">Peso Total</span>
          <span className="value">{totals.totalWeight} kg</span>
        </div>
        <div className="summary-mini">
          <span className="label">Consumo Máx.</span>
          <span className="value">{totals.totalConsumption} kW</span>
        </div>
      </div>

      <button className="btn-download-pdf" onClick={() => window.print()}>
        Descargar PDF Técnico
      </button>
    </div>
  );
};

export default Summary;
