// filepath: frontend/alfalite-frontend/src/pages/Configurator/ConfiguratorPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import "./Configurator.css";
import { useProducts, type Product } from "../hooks/useProducts"; // Asegúrate de que la ruta sea correcta

const ConfiguratorPage: React.FC = () => {
  // 1. Obtenemos los productos reales de tu base de datos/hook
  const { products, loading, fetchAll } = useProducts();

  // cargar el catálogo una sola vez al montar
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const [filters, setFilters] = useState({
    location: "All",
    application: "All",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tilesH, setTilesH] = useState(4); // Columnas
  const [tilesV, setTilesV] = useState(3); // Filas

  const stats = useMemo(() => {
    if (!selectedProduct) return null;
    const totalTiles = tilesH * tilesV;
    const widthM = (tilesH * selectedProduct.width) / 1000;
    const heightM = (tilesV * selectedProduct.height) / 1000;
    const resH = tilesH * selectedProduct.horizontal;
    const resV = tilesV * selectedProduct.vertical;

    // Cálculo simple de aspecto
    const aspect = (resH / resV).toFixed(2);

    return {
      totalTiles,
      widthM,
      heightM,
      resH,
      resV,
      aspect,
      area: widthM * heightM,
      weight: totalTiles * selectedProduct.weight,
      powerMax: totalTiles * selectedProduct.consumption,
      powerAvg: totalTiles * selectedProduct.consumption * 0.35,
      btu: totalTiles * selectedProduct.consumption * 3.412,
    };
  }, [selectedProduct, tilesH, tilesV]);

  if (loading) return <div className="loading">Cargando configurador...</div>;

  return (
    <div className="config-layout">
      {/* 1. PANEL IZQUIERDO: CONTROLES */}
      <aside className="config-panel left-panel glass-panel">
        <div className="panel-header">
          <h2>Configuración</h2>
        </div>
        <div className="panel-content">
          <div className="filter-group">
            <label>Localización</label>
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            >
              <option value="All">Todos</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>

            <label>Aplicación</label>
            <select
              value={filters.application}
              onChange={(e) =>
                setFilters({ ...filters, application: e.target.value })
              }
            >
              <option value="All">Todos</option>
              <option value="Rental">Rental</option>
              <option value="Fixed">Fixed Install</option>
              <option value="Broadcast">Broadcast</option>
            </select>
          </div>

          <div className="product-selection-list">
            {(() => {
              const filtered = products.filter((p) => {
                // helper to check array contains value, case-insensitive
                const contains = (arr: string[] | undefined, val: string) => {
                  if (!arr || val === "All") return true;
                  return arr.some((x) => x.toLowerCase() === val.toLowerCase());
                };
                return (
                  contains(p.location, filters.location) &&
                  contains(p.application, filters.application)
                );
              });
              if (filtered.length === 0) {
                return (
                  <div className="placeholder-box">
                    No se encontró ningún producto para esos filtros.
                  </div>
                );
              }
              return filtered.map((p) => (
                <div
                  key={p.id}
                  className={`product-item-card ${
                    selectedProduct?.id === p.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedProduct(p)}
                >
                  <img
                    src={
                      p.image
                        ? `${import.meta.env.VITE_API_URL || "http://localhost:1337"}/${p.image}`
                        : "/placeholder-led.webp"
                    }
                    alt={p.name}
                  />
                  <div className="item-info">
                    <h4>{p.name}</h4>
                    <p>
                      {p.pixelPitch}mm | {p.horizontal}x{p.vertical}px
                    </p>
                    <span className="badge">
                      {Array.isArray(p.location)
                        ? p.location.join(", ")
                        : p.location}
                    </span>
                    {p.application && p.application.length > 0 && (
                      <span className="badge">
                        {Array.isArray(p.application)
                          ? p.application.join(", ")
                          : p.application}
                      </span>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>

          {selectedProduct && (
            <div className="dimension-sliders">
              <div className="slider-group">
                <label>Ancho (Tiles: {tilesH})</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={tilesH}
                  onChange={(e) => setTilesH(parseInt(e.target.value))}
                />
              </div>
              <div className="slider-group">
                <label>Alto (Tiles: {tilesV})</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={tilesV}
                  onChange={(e) => setTilesV(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. PANEL CENTRAL: VISUALIZADOR */}
      <main className="config-main">
        <header className="canvas-header">
          <div className="model-badge">
            {selectedProduct
              ? `Modelo: ${selectedProduct.name}`
              : "Selecciona un modelo"}
          </div>
          <div className="canvas-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setTilesH(4);
                setTilesV(3);
              }}
            >
              Reset
            </button>
            <button className="btn-secondary">Captura</button>
          </div>
        </header>

        <div className="canvas-area">
          {selectedProduct ? (
            <div className="visualizer-container">
              <div className="measure-h">{stats?.widthM.toFixed(2)}m</div>
              <div className="measure-v">{stats?.heightM.toFixed(2)}m</div>

              <div
                className={`led-grid-simulation ${tilesH * tilesV === 0 ? "no-bg" : ""}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${tilesH}, 1fr)`,
                  gridTemplateRows: `repeat(${tilesV}, 1fr)`,
                  aspectRatio: `${stats?.widthM}/${stats?.heightM}`,
                }}
              >
                {(() => {
                  const imageUrl = selectedProduct.image
                    ? `${import.meta.env.VITE_API_URL || "http://localhost:1337"}/${selectedProduct.image}`
                    : "/placeholder-led.webp";
                  return Array.from({ length: tilesH * tilesV }).map((_, i) => {
                    const col = i % tilesH;
                    const row = Math.floor(i / tilesH);
                    return (
                      <div
                        key={i}
                        className="grid-tile"
                        style={{
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: `${100 * tilesH}% ${100 * tilesV}%`,
                          backgroundPosition: `${(100 / tilesH) * col}% ${(100 / tilesV) * row}%`,
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                    );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className="canvas-placeholder">
              <p>Selecciona un producto Alfalite para comenzar la simulación</p>
            </div>
          )}
        </div>

        <footer className="canvas-footer">
          <div className="quick-stats">
            <span>
              Ancho: <strong>{stats?.widthM.toFixed(2) || 0}m</strong>
            </span>
            <span>
              Alto: <strong>{stats?.heightM.toFixed(2) || 0}m</strong>
            </span>
            <span>
              Aspecto: <strong>{stats?.aspect || "0.00"}</strong>
            </span>
          </div>
        </footer>
      </main>

      {/* 3. PANEL DERECHO: RESULTADOS TÉCNICOS */}
      <aside className="config-panel right-panel glass-panel">
        <div className="panel-header">
          <h2>Resumen Técnico</h2>
        </div>
        <div className="panel-content">
          <div className="tech-specs-table">
            <div className="spec-row">
              <span>Resolución</span>
              <strong>
                {stats ? `${stats.resH} x ${stats.resV} px` : "---"}
              </strong>
            </div>
            <div className="spec-row">
              <span>Dimensiones</span>
              <strong>
                {stats
                  ? `${stats.widthM.toFixed(2)} x ${stats.heightM.toFixed(2)} m`
                  : "---"}
              </strong>
            </div>
            <div className="spec-row">
              <span>Superficie</span>
              <strong>{stats ? `${stats.area.toFixed(2)} m²` : "---"}</strong>
            </div>
            <div className="spec-row">
              <span>Total Cabinets</span>
              <strong>{stats?.totalTiles || 0}</strong>
            </div>
            <div className="spec-row">
              <span>Peso Total</span>
              <strong>{stats ? `${stats.weight.toFixed(1)} Kg` : "---"}</strong>
            </div>
            <hr />
            <div className="spec-row">
              <span>Consumo Máx</span>
              <strong>
                {stats ? `${stats.powerMax.toFixed(2)} kW` : "---"}
              </strong>
            </div>
            <div className="spec-row">
              <span>Consumo Medio</span>
              <strong>
                {stats ? `${stats.powerAvg.toFixed(2)} kW` : "---"}
              </strong>
            </div>
            <div className="spec-row">
              <span>Disipación Calor</span>
              <strong>{stats ? `${stats.btu.toFixed(0)} BTU/h` : "---"}</strong>
            </div>
          </div>

          <button className="btn-primary-full" disabled={!selectedProduct}>
            GENERAR FICHA TÉCNICA PDF
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ConfiguratorPage;
