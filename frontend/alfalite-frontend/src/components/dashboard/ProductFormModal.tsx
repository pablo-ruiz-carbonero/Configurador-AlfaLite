// filepath: frontend/alfalite-frontend/src/components/dashboard/ProductFormModal.tsx
import React, { useState } from "react";
import type { Product } from "../../types/product";

interface Props {
  initialData: Product | null;
  onClose: () => void;
  onSave: (data: Product, isEditing: boolean) => void;
}

const emptyProduct: Product = {
  name: "",
  location: [],
  application: [],
  horizontal: 0,
  vertical: 0,
  pixelPitch: 0,
  width: 0,
  height: 0,
  depth: 0,
  consumption: 0,
  weight: 0,
  refreshRate: 0,
  contrast: "",
  visionAngle: "",
  redundancy: "",
  curvedVersion: "",
  opticalMultilayerInjection: "",
  brightness: 0,
};

const ProductFormModal: React.FC<Props> = ({
  initialData,
  onClose,
  onSave,
}) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<Product>(
    initialData || emptyProduct,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
    // Limpiar error al escribir
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((i) => i.trim()),
    }));
  };

  const validateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Obligatorio";
    if (formData.pixelPitch <= 0) newErrors.pixelPitch = "Pitch inválido";
    if (formData.brightness <= 0) newErrors.brightness = "Brillo obligatorio";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData, isEditing);
  };

  const renderInput = (
    label: string,
    name: string,
    placeholder: string = "",
    type = "text",
    step = "1",
  ) => (
    <div className={`input-group ${errors[name] ? "has-error" : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        step={step}
        placeholder={placeholder}
        value={(formData as any)[name] ?? ""}
        onChange={handleInputChange}
        className={errors[name] ? "input-error" : ""}
      />
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h2>{isEditing ? "Editar Especificaciones" : "Nueva Pantalla"}</h2>

        <form onSubmit={validateAndSave} className="product-form">
          <div className="form-grid">
            {/* --- SECCIÓN BÁSICA --- */}
            {renderInput("Nombre del Modelo *", "name", "Ej: Litepix P2.6")}
            {renderInput(
              "Pixel Pitch (mm) *",
              "pixelPitch",
              "Ej: 2.6",
              "number",
              "0.01",
            )}
            {renderInput("Brillo (nits) *", "brightness", "Ej: 1500", "number")}

            {/* --- ARRAYS (LOCATION Y APPLICATION) --- */}
            <div className="input-group">
              <label>Localización (separar con comas)</label>
              <input
                name="location"
                placeholder="Ej: Indoor, Outdoor"
                value={formData.location.join(", ")}
                onChange={handleArrayChange}
              />
            </div>
            <div className="input-group">
              <label>Aplicación (separar con comas)</label>
              <input
                name="application"
                placeholder="Ej: Rental, Corporate"
                value={formData.application.join(", ")}
                onChange={handleArrayChange}
              />
            </div>

            {/* --- PÍXELES --- */}
            {renderInput("Píxeles H", "horizontal", "Ej: 192", "number")}
            {renderInput("Píxeles V", "vertical", "Ej: 192", "number")}

            {/* --- MEDIDAS --- */}
            {renderInput("Ancho (mm)", "width", "Ej: 500", "number", "0.01")}
            {renderInput("Alto (mm)", "height", "Ej: 500", "number", "0.01")}
            {renderInput(
              "Profundidad (mm)",
              "depth",
              "Ej: 75",
              "number",
              "0.01",
            )}

            {/* --- CARACTERÍSTICAS FÍSICAS --- */}
            {renderInput(
              "Consumo (kW/h)",
              "consumption",
              "Ej: 0.18",
              "number",
              "0.01",
            )}
            {renderInput("Peso (kg)", "weight", "Ej: 7.2", "number", "0.01")}
            {renderInput(
              "Tasa Refresco (Hz)",
              "refreshRate",
              "Ej: 3840",
              "number",
            )}

            {/* --- TEXTOS ADICIONALES --- */}
            {renderInput("Contraste", "contrast", "Ej: 5000:1")}
            {renderInput("Ángulo de Visión", "visionAngle", "Ej: 160º")}
            {renderInput("Redundancia", "redundancy", "Ej: Sí / No")}
            {renderInput("Versión Curva", "curvedVersion", "Ej: +/- 15º")}
            {renderInput(
              "Inyección Óptica",
              "opticalMultilayerInjection",
              "Ej: Sí",
            )}
          </div>

          <button type="submit" className="btn-submit">
            {isEditing ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
