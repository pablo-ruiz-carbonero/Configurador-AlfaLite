// filepath: frontend/alfalite-frontend/src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "../assets/logo_horizontal_peq.webp";

// Hook que centraliza la lógica de la API
import { useProducts, type Product } from "../hooks/useProducts";

// Estado inicial para limpiar el formulario
const initialProductState: Product = {
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
  refreshRate: 0, // Campo Hz
  contrast: "",
  visionAngle: "",
  redundancy: "",
  curvedVersion: "",
  opticalMultilayerInjection: "",
  brightness: 0,
};

const Dashboard: React.FC = () => {
  // --- HOOK DE PRODUCTOS ---
  const { products, loading, fetchAll, create, update, remove } = useProducts();

  // --- ESTADOS DE UI ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Modal "Ver más"
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Modal Crear/Editar
  const [productToDelete, setProductToDelete] = useState<number | null>(null); // Modal Confirmación

  // --- ESTADOS DE FORMULARIO ---
  const [formData, setFormData] = useState<Product>(initialProductState);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const token = localStorage.getItem("alfalite_token");

  // --- EFECTO INICIAL ---
  useEffect(() => {
    if (!token) navigate("/");
    else fetchAll();
  }, [token, navigate, fetchAll]);

  // --- VALIDACIÓN DE FORMULARIO ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (formData.pixelPitch <= 0) newErrors.pixelPitch = "Pitch inválido";
    if (formData.brightness <= 0) newErrors.brightness = "Brillo obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HANDLERS: CRUD ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && formData.id) {
        await update(formData.id, formData);
      } else {
        await create(formData);
      }
      closeFormModal();
      fetchAll(); // Refrescar lista
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await remove(productToDelete);
      setProductToDelete(null);
      fetchAll(); // Refrescar lista
    } catch (err) {
      console.error("Error al borrar:", err);
    }
  };

  // --- HANDLERS: MODALES ---
  const openCreateModal = () => {
    setFormData(initialProductState);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const openEditModal = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(product);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setErrors({});
  };

  // --- HANDLERS: INPUTS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      // Solución al problema de números/Hz: Si está vacío, ponemos 0
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((i) => i.trim()),
    });
  };

  // Helper para renderizar inputs con placeholders y validación
  const renderInput = (
    label: string,
    name: string,
    placeholder: string,
    type: string = "text",
    step: string = "1",
  ) => (
    <div className={`input-group ${errors[name] ? "has-error" : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        step={step}
        placeholder={placeholder}
        value={(formData as any)[name] || ""}
        onChange={handleInputChange}
        className={errors[name] ? "input-error" : ""}
      />
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  // --- FILTRO DE BÚSQUEDA ---
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (loading && products.length === 0) {
    return (
      <div className="loading">
        <span>Cargando catálogo...</span>
      </div>
    );
  }

  return (
    <div className="app-container dashboard-vertical">
      {/* NAVEGACIÓN */}
      <nav className="top-nav glass-panel">
        <div className="logo">
          <img src={logo} alt="Alfalite" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar modelo (Ej: Litepix, Modular...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-icon-new" onClick={openCreateModal}>
          + Nuevo producto
        </button>
      </nav>

      {/* GRID DE PRODUCTOS */}
      <div className="cards-grid">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="product-card glass-panel"
            onClick={() => setSelectedProduct(p)}
          >
            <div className="card-image">
              <img
                src={
                  p.image
                    ? `http://localhost:1337/${p.image}`
                    : "https://via.placeholder.com/300x200?text=Alfalite"
                }
                alt={p.name}
              />
            </div>
            <div className="card-info">
              <h3>{p.name}</h3>
            </div>
            <div className="card-actions">
              <button
                className="btn-icon edit"
                onClick={(e) => openEditModal(p, e)}
              >
                ✏️
              </button>
              <button
                className="btn-icon delete"
                onClick={(e) => {
                  e.stopPropagation();
                  p.id && setProductToDelete(p.id);
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: FORMULARIO COMPLETO */}
      {isFormModalOpen && (
        <div className="modal-overlay" onClick={closeFormModal}>
          <div
            className="modal-content glass-panel form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeFormModal}>
              &times;
            </button>
            <h2>{isEditing ? "Editar Especificaciones" : "Nueva Pantalla"}</h2>
            <form onSubmit={handleSaveProduct} className="product-form">
              <div className="form-grid">
                {renderInput("Nombre del Modelo *", "name", "Ej: Litepix P2.6")}
                {renderInput(
                  "Pixel Pitch (mm) *",
                  "pixelPitch",
                  "Ej: 2.6",
                  "number",
                  "0.01",
                )}
                {renderInput(
                  "Brillo (nits) *",
                  "brightness",
                  "Ej: 1500",
                  "number",
                )}

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

                {renderInput("Píxeles H", "horizontal", "Ej: 192", "number")}
                {renderInput("Píxeles V", "vertical", "Ej: 192", "number")}
                {renderInput(
                  "Ancho (mm)",
                  "width",
                  "Ej: 500",
                  "number",
                  "0.01",
                )}
                {renderInput(
                  "Alto (mm)",
                  "height",
                  "Ej: 500",
                  "number",
                  "0.01",
                )}
                {renderInput(
                  "Profundidad (mm)",
                  "depth",
                  "Ej: 75",
                  "number",
                  "0.01",
                )}
                {renderInput(
                  "Consumo (kW/h)",
                  "consumption",
                  "Ej: 0.18",
                  "number",
                  "0.01",
                )}
                {renderInput(
                  "Peso (kg)",
                  "weight",
                  "Ej: 7.2",
                  "number",
                  "0.01",
                )}
                {renderInput(
                  "Tasa Refresco (Hz)",
                  "refresh_rate",
                  "Ej: 3840",
                  "number",
                )}
                {renderInput("Contraste", "constrat", "Ej: 5000:1")}
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
      )}

      {/* MODAL: CONFIRMACIÓN DE BORRADO */}
      {productToDelete && (
        <div className="modal-overlay" onClick={() => setProductToDelete(null)}>
          <div
            className="modal-content glass-panel confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="danger-text">⚠️ Confirmar Borrado</h2>
            <p>
              ¿Seguro que quieres eliminar este producto? Esta acción es
              irreversible.
            </p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setProductToDelete(null)}
              >
                Cancelar
              </button>
              <button className="btn-delete-confirm" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VER DETALLES */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div
            className="modal-content glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            <div className="modal-body">
              <h2>{selectedProduct.name}</h2>
              {selectedProduct.image && (
                <div className="product-image-container">
                  <img
                    src={`http://localhost:1337/${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="product-image"
                  />
                </div>
              )}
              <div className="specs-grid">
                <div>
                  <strong>Localización:</strong>{" "}
                  {selectedProduct.location.join(", ")}
                </div>
                <div>
                  <strong>Aplicación:</strong>{" "}
                  {selectedProduct.application.join(", ")}
                </div>
                <div>
                  <strong>Píxeles Horizontales:</strong>{" "}
                  {selectedProduct.horizontal}
                </div>
                <div>
                  <strong>Píxeles Verticales:</strong>{" "}
                  {selectedProduct.vertical}
                </div>
                <div>
                  <strong>Pixel Pitch:</strong> {selectedProduct.pixelPitch}mm
                </div>
                <div>
                  <strong>Ancho:</strong> {selectedProduct.width}mm
                </div>
                <div>
                  <strong>Alto:</strong> {selectedProduct.height}mm
                </div>
                <div>
                  <strong>Profundidad:</strong> {selectedProduct.depth}mm
                </div>
                <div>
                  <strong>Consumo:</strong> {selectedProduct.consumption} kW/h
                </div>
                <div>
                  <strong>Peso:</strong> {selectedProduct.weight}kg
                </div>
                <div>
                  <strong>Brillo:</strong> {selectedProduct.brightness} nits
                </div>
                {selectedProduct.refreshRate && (
                  <div>
                    <strong>Tasa de Refresco:</strong>{" "}
                    {selectedProduct.refreshRate}Hz
                  </div>
                )}
                {selectedProduct.contrast && (
                  <div>
                    <strong>Contraste:</strong> {selectedProduct.contrast}
                  </div>
                )}
                {selectedProduct.visionAngle && (
                  <div>
                    <strong>Ángulo de Visión:</strong>{" "}
                    {selectedProduct.visionAngle}
                  </div>
                )}
                {selectedProduct.redundancy && (
                  <div>
                    <strong>Redundancia:</strong> {selectedProduct.redundancy}
                  </div>
                )}
                {selectedProduct.curvedVersion && (
                  <div>
                    <strong>Versión Curva:</strong>{" "}
                    {selectedProduct.curvedVersion}
                  </div>
                )}
                {selectedProduct.opticalMultilayerInjection && (
                  <div>
                    <strong>Inyección Óptica:</strong>{" "}
                    {selectedProduct.opticalMultilayerInjection}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
