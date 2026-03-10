// src/components/configurator/Sidebar.tsx
import React from "react";
import { type Product } from "../../hooks/useProducts";

interface Props {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (p: Product) => void;
  cols: number;
  setCols: (n: number) => void;
  rows: number;
  setRows: (n: number) => void;
}

const Sidebar: React.FC<Props> = ({
  products,
  selectedProduct,
  onProductSelect,
  cols,
  setCols,
  rows,
  setRows,
}) => {
  return (
    <aside className="config-sidebar glass-panel">
      <h2>Configurador Alfalite</h2>

      {selectedProduct && selectedProduct.image && (
        <div className="product-preview">
          <img
            src={`http://localhost:1337/${selectedProduct.image}`}
            alt={selectedProduct.name}
          />
        </div>
      )}

      {selectedProduct && (
        <div className="product-specs">
          <p>
            <strong>Pitch:</strong> {selectedProduct.pixelPitch} mm
          </p>
          <p>
            <strong>Cabinet:</strong> {selectedProduct.width} x{" "}
            {selectedProduct.height} mm
          </p>
        </div>
      )}

      <div className="control-group">
        <label>Modelo de Pantalla</label>
        <select
          value={selectedProduct?.id || ""}
          onChange={(e) => {
            const p = products.find(
              (prod) => prod.id === Number(e.target.value),
            );
            if (p) onProductSelect(p);
          }}
        >
          <option value="" disabled>
            Selecciona un modelo...
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-grid">
        <div className="control-group">
          <label>Columnas (H)</label>
          <div className="number-input">
            <button onClick={() => setCols(Math.max(0, cols - 1))}>-</button>
            <input
              type="number"
              value={cols}
              onChange={(e) =>
                setCols(Math.max(1, Number(e.target.value) || 1))
              }
            />
            <button onClick={() => setCols(cols + 1)}>+</button>
          </div>
        </div>

        <div className="control-group">
          <label>Filas (V)</label>
          <div className="number-input">
            <button onClick={() => setRows(Math.max(0, rows - 1))}>-</button>
            <input
              type="number"
              value={rows}
              onChange={(e) =>
                setRows(Math.max(1, Number(e.target.value) || 1))
              }
            />
            <button onClick={() => setRows(rows + 1)}>+</button>
          </div>
        </div>
      </div>

      <div className="info-box">
        <p>
          Ajusta el tamaño de tu pantalla LED para obtener cálculos precisos de
          resolución y consumo.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
