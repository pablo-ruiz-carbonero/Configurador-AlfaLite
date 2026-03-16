import React from "react";
import type { Product } from "../../types/product";
import { API_BASE_URL } from "../../api/apiClientPublic";

interface Props {
  product: Product;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<Props> = ({ product, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>

        <div className="modal-body">
          <h2>{product.name}</h2>

          {product.image && (
            <div className="product-image-container">
              <img
                src={`${API_BASE_URL}/${product.image}`}
                alt={product.name}
                className="product-image"
              />
            </div>
          )}

          <div className="specs-grid">
            <SpecItem
              label="Localización"
              value={product.location.join(", ")}
            />
            <SpecItem
              label="Aplicación"
              value={product.application.join(", ")}
            />
            <SpecItem label="Píxeles H" value={product.horizontal} />
            <SpecItem label="Píxeles V" value={product.vertical} />
            <SpecItem label="Pixel Pitch" value={`${product.pixelPitch}mm`} />
            <SpecItem
              label="Dimensiones"
              value={`${product.width} x ${product.height} x ${product.depth} mm`}
            />
            <SpecItem label="Consumo" value={`${product.consumption} kW/h`} />
            <SpecItem label="Peso" value={`${product.weight}kg`} />
            <SpecItem label="Brillo" value={`${product.brightness} nits`} />

            {product.refreshRate && (
              <SpecItem
                label="Tasa Refresco"
                value={`${product.refreshRate}Hz`}
              />
            )}
            {product.contrast && (
              <SpecItem label="Contraste" value={product.contrast} />
            )}
            {product.visionAngle && (
              <SpecItem label="Ángulo Visión" value={product.visionAngle} />
            )}
            {product.redundancy && (
              <SpecItem label="Redundancia" value={product.redundancy} />
            )}
            {product.curvedVersion && (
              <SpecItem label="Versión Curva" value={product.curvedVersion} />
            )}
            {product.opticalMultilayerInjection && (
              <SpecItem
                label="Inyección Óptica"
                value={product.opticalMultilayerInjection}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-componente interno para no repetir estructura
const SpecItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="spec-item">
    <strong>{label}:</strong> <span>{value || "N/A"}</span>
  </div>
);

export default ProductDetailsModal;
