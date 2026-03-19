import { useState, useEffect, useMemo } from "react";
import "./Configurator.css";
import { useProductsConfigurator } from "../hooks/useProducts";
import type { Product } from "../types/product";
import ProductList from "../components/configurator/ProductList";
import ProductFilters from "../components/configurator/ProductFilters";
import DimensionControls from "../components/configurator/DimensionsControls";
import ResultsData from "../components/configurator/ResultsData";
import { calculateStats, type Stats, type Unit } from "../utils/calculateStats";
import ScreenCanvas from "../components/configurator/ScreenCanvas";
import ModalButtons from "../components/configurator/ModalButtons";
import type { ModalAction } from "../components/configurator/ModalButtons";

function ConfiguratorPage() {
  const { products, loading, getAll } = useProductsConfigurator();

  useEffect(() => {
    getAll();
  }, []);

  const [filters, setFilters] = useState({
    location: "All",
    application: "All",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tilesH, setTilesH] = useState(16);
  const [tilesV, setTilesV] = useState(9);
  const [unit, setUnit] = useState<Unit>("ft");

  const contains = (arr: string | string[] | undefined, val: string) => {
    if (val === "All" || !arr) return true;
    if (typeof arr === "string") return arr.toLowerCase() === val.toLowerCase();
    return arr.some((x) => x.toLowerCase() === val.toLowerCase());
  };

  const filteredProducts = products.filter(
    (p) =>
      contains(p.location, filters.location) &&
      contains(p.application, filters.application),
  );

  const stats: Stats | null = useMemo(() => {
    if (!selectedProduct) return null;
    return calculateStats(selectedProduct, tilesH, tilesV, unit);
  }, [selectedProduct, tilesH, tilesV, unit]);

  const [modalAction, setModalAction] = useState<ModalAction>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const handleActionClick = (action: ModalAction) => {
    if (!selectedProduct || !stats) {
      alert("Please select a product first to configure the screen.");
      return;
    }
    setModalAction(action);
  };

  const handleFormSubmit = (formData: any) => {
    if (modalAction === "pdf") {
      console.log("Saving PDF...", selectedProduct, formData);
      // Lógica de PDF aquí
    } else if (modalAction === "quote") {
      console.log("Requesting Quote...", selectedProduct, formData);
      // Lógica de envío al backend aquí
    }
    setModalAction(null); // Cerramos el modal
  };

  const copyResultsToClipboard = () => {
    if (!selectedProduct || !stats) {
      alert("Select a product and configure dimensions to copy results.");
      return;
    }

    const lines = [
      `Product: ${selectedProduct.name}`,
      `Resolution: ${stats.resH} x ${stats.resV} px`,
      `Dimensions: ${stats.widthM.toFixed(2)} x ${stats.heightM.toFixed(2)} x ${stats.depth.toFixed(2)} ${stats.dimUnit}`,
      `Diagonal: ${stats.diagonal.toFixed(2)} ${stats.dimUnit}`,
      `Aspect ratio: ${stats.aspect}`,
      `Surface: ${stats.surface.toFixed(2)} ${stats.surfaceUnit}`,
      `Max. power consumption: ${stats.powerMax.toFixed(2)} kW`,
      `Avg. power consumption: ${stats.powerAvg.toFixed(2)} kW`,
      `Weight: ${stats.weight.toFixed(2)} kg`,
      `Opt. view distance: >${stats.optViewDistance.toFixed(2)} ${stats.dimUnit}`,
      `Brightness: ${selectedProduct.brightness ?? 0} cd/m2`,
      `Total tiles: ${stats.totalTiles}`,
    ];

    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => {
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 1800);
      })
      .catch(() => {
        setCopyStatus("failed");
        setTimeout(() => setCopyStatus("idle"), 1800);
      });
  };

  return (
    <>
      <div className="title-row">
        <h1 className="page-title">Led Screen Configurator</h1>
      </div>

      <main className="configurator-container">
        <div className="cfg-grid">
          {/* 1. PRODUCT */}
          <aside className="cfg-panel panel-product">
            <div className="panel-header">
              <h3>1. Choose a product</h3>
            </div>
            <div className="panel-body">
              {loading ? (
                <div className="cfg-loading">Loading products...</div>
              ) : (
                <>
                  <ProductFilters filters={filters} setFilters={setFilters} />
                  <ProductList
                    products={filteredProducts}
                    selectedProduct={selectedProduct}
                    onSelectProduct={setSelectedProduct}
                  />
                </>
              )}
            </div>
          </aside>

          {/* 2. DIMENSIONS */}
          <section className="cfg-panel panel-dimensions">
            <div className="panel-header">
              <h3>2. Dimensions</h3>
            </div>
            <div className="panel-body">
              {selectedProduct ? (
                <DimensionControls
                  tilesH={tilesH}
                  tilesV={tilesV}
                  setTilesH={setTilesH}
                  setTilesV={setTilesV}
                  unit={unit}
                  setUnit={setUnit}
                  product={selectedProduct}
                />
              ) : (
                <p className="cfg-placeholder">Select a product first.</p>
              )}
            </div>
          </section>

          {/* 3. RESULTS */}
          <section className="cfg-panel panel-results">
            <div className="panel-header results-header-wrap">
              <h3>3. Results</h3>
              <div className="copy-action-wrap">
                <button
                  type="button"
                  className="btn-copy"
                  onClick={copyResultsToClipboard}
                >
                  Copy in clipboard
                </button>
                <span className={`copy-feedback ${copyStatus}`}>
                  {copyStatus === "copied" && "Copied!"}
                  {copyStatus === "failed" && "Copy failed"}
                </span>
              </div>
            </div>
            <div className="panel-body">
              {selectedProduct && stats ? (
                <ResultsData product={selectedProduct} stats={stats} />
              ) : (
                <p className="cfg-placeholder">No product selected.</p>
              )}
            </div>
          </section>

          {/* 4. CANVAS */}
          <section className="cfg-panel panel-canvas">
            <div className="panel-header">
              <h3>4. Canvas</h3>
            </div>
            <div className="panel-body panel-body--canvas">
              {selectedProduct && stats ? (
                <ScreenCanvas
                  tilesH={tilesH}
                  tilesV={tilesV}
                  product={selectedProduct}
                  stats={stats}
                  unit={unit}
                />
              ) : (
                <p className="cfg-placeholder">
                  Select a product to see preview.
                </p>
              )}
            </div>
          </section>
        </div>
        <div className="main-action-section">
          <button
            className="btn-action"
            onClick={() => handleActionClick("pdf")}
          >
            Save as PDF
          </button>
          <button
            className="btn-action btn-action-primary"
            onClick={() => handleActionClick("quote")}
          >
            Request a Quote
          </button>
        </div>

        {/* --- MODAL ADAPTADO --- */}
        {modalAction && selectedProduct && stats && (
          <ModalButtons
            actionType={modalAction}
            selectedProduct={selectedProduct}
            stats={stats}
            onSubmit={handleFormSubmit}
            onClose={() => setModalAction(null)}
          />
        )}
      </main>
    </>
  );
}

export default ConfiguratorPage;
