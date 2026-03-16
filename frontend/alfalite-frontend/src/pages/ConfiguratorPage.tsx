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

  return (
    <>
      <h1 className="page-title">Led Screen Configurator</h1>

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
                />
              ) : (
                <p className="cfg-placeholder">Select a product first.</p>
              )}
            </div>
          </section>

          {/* 3. RESULTS */}
          <section className="cfg-panel panel-results">
            <div className="panel-header">
              <h3>3. Results</h3>
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
      </main>
    </>
  );
}

export default ConfiguratorPage;
