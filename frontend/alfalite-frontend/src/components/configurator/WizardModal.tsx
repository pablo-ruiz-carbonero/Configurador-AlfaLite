import { type FC, useMemo, useState } from "react";
import type { Product } from "../../types/product";
import type { Stats } from "../../utils/calculateStats";
import "./css/WizardModal.css";

interface WizardModalProps {
  open: boolean;
  product: Product;
  stats: Stats;
  tilesH: number;
  tilesV: number;
  unit: "ft" | "m";
  onClose: () => void;
  onFinished?: (data: {
    product: Product;
    tilesH: number;
    tilesV: number;
    unit: "ft" | "m";
    stats: Stats;
  }) => void;
}

const steps = ["Producto", "Dimensiones", "Resultado"];

const WizardModal: FC<WizardModalProps> = ({
  open,
  product,
  stats,
  tilesH,
  tilesV,
  unit,
  onClose,
  onFinished,
}) => {
  const [step, setStep] = useState(0);

  const hasPrevious = step > 0;
  const hasNext = step < steps.length - 1;

  const summary = useMemo(
    () => ({
      product,
      tilesH,
      tilesV,
      unit,
      stats,
    }),
    [product, tilesH, tilesV, unit, stats],
  );

  if (!open) return null;

  return (
    <div className="wizard-modal-overlay" onClick={onClose}>
      <div
        className="wizard-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="wizard-modal-header">
          <h2>{steps[step]}</h2>
          <button
            className="wizard-close"
            type="button"
            onClick={onClose}
            aria-label="Cerrar wizard"
          >
            ×
          </button>
        </header>

        <div className="wizard-step-content">
          {step === 0 && (
            <div>
              <p>
                Seleccionado: <strong>{product.name}</strong>
              </p>
              <p>Ubicación: {product.location}</p>
              <p>Aplicación: {product.application}</p>
              <p>
                Resolución base: {product.horizontal}x{product.vertical}
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <p>Configuración de la pantalla</p>
              <ul>
                <li>Tiles horizontales: {tilesH}</li>
                <li>Tiles verticales: {tilesV}</li>
                <li>Unidad: {unit}</li>
                <li>
                  Dimensiones finales: {stats.widthM.toFixed(2)} x{" "}
                  {stats.heightM.toFixed(2)} {stats.dimUnit}
                </li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <div>
              <p>Resultados finales</p>
              <ul>
                <li>
                  Resolución total: {stats.resH} x {stats.resV}
                </li>
                <li>
                  Diagonal: {stats.diagonal.toFixed(2)} {stats.dimUnit}
                </li>
                <li>Consumo máximo: {stats.powerMax.toFixed(2)} kW</li>
                <li>Consumo promedio: {stats.powerAvg.toFixed(2)} kW</li>
                <li>Peso: {stats.weight.toFixed(2)} kg</li>
              </ul>
            </div>
          )}
        </div>

        <footer className="wizard-modal-footer">
          <div className="wizard-stepper-info">
            {step + 1} / {steps.length}
          </div>

          <div className="wizard-actions">
            {hasPrevious && (
              <button type="button" onClick={() => setStep((prev) => prev - 1)}>
                Atrás
              </button>
            )}

            {hasNext ? (
              <button type="button" onClick={() => setStep((prev) => prev + 1)}>
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                className="wizard-finish"
                onClick={() => {
                  onFinished?.(summary);
                  onClose();
                }}
              >
                Finalizar
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WizardModal;
