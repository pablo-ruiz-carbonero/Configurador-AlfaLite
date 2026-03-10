// src/components/configurator/Canvas.tsx
import React from "react";

interface Props {
  config: any;
}

const Canvas: React.FC<Props> = ({ config }) => {
  const { cols, rows, selectedProduct } = config;

  return (
    <div className="canvas-container">
      {!selectedProduct ? (
        <div className="canvas-empty">
          <p>Selecciona un modelo para visualizar la configuración</p>
        </div>
      ) : (
        <div className="canvas-viewport">
          <div
            className="led-grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              aspectRatio: `${(cols * selectedProduct.width) / (rows * selectedProduct.height)}`,
            }}
          >
            {Array.from({ length: cols * rows }).map((_, i) => (
              <div key={i} className="cabinet-unit">
                {selectedProduct.image && (
                  <img
                    src={`http://localhost:1337/${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="cabinet-thumb"
                  />
                )}
                {i === 0 && <span>{selectedProduct.pixelPitch}mm</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
