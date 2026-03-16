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
import imageTest from "../assets/fotoDeEjemplo.jpg";

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
  const [tilesH, setTilesH] = useState(4);
  const [tilesV, setTilesV] = useState(3);
  const [unit, setUnit] = useState<Unit>("m");

  const contains = (arr: string | string[] | undefined, val: string) => {
    if (val === "All" || !arr) return true;
    if (typeof arr === "string") {
      return arr.toLowerCase() === val.toLowerCase();
    }
    return arr.some((x) => x.toLowerCase() === val.toLowerCase());
  };

  const filteredProducts = products.filter((p) => {
    return (
      contains(p.location, filters.location) &&
      contains(p.application, filters.application)
    );
  });

  const stats: Stats | null = useMemo(() => {
    if (!selectedProduct) return null;
    return calculateStats(selectedProduct, tilesH, tilesV, unit);
  }, [selectedProduct, tilesH, tilesV, unit]);

  return (
    <>
      <h2>Led Screen Configurator</h2>

      <main className="container">
        <div className="grid">
          {/* PANEL PRODUCTOS */}
          <aside className="config-panel left-panel glass-panel ContainerChooseAProduct">
            <div className="panel-header">
              <h2>1. Choose a Product</h2>
            </div>

            <div className="panel-content">
              {loading ? (
                <div className="loading">Cargando productos...</div>
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

          {/* PANEL DIMENSIONS */}
          <section className="Dimensions">
            <div className="panel-header">
              <h2>2. Dimensions</h2>
            </div>
            {selectedProduct && (
              <DimensionControls
                tilesH={tilesH}
                tilesV={tilesV}
                setTilesH={setTilesH}
                setTilesV={setTilesV}
                unit={unit}
                setUnit={setUnit}
              />
            )}
          </section>

          {/* PANEL RESULTS */}
          <section className="Results">
            <div className="panel-header">
              <h2>3. Results</h2>
            </div>

            {selectedProduct && stats && (
              <ResultsData
                product={selectedProduct}
                stats={stats}
                unit={unit}
              />
            )}
          </section>
          {/* PANEL CANVAS */}
          <section className="Canvas">
            <div className="panel-header">
              <h2>4. Canvas</h2>
            </div>

            {selectedProduct && (
              <ScreenCanvas
                tilesH={tilesH}
                tilesV={tilesV}
                image={imageTest}
                product={selectedProduct}
              />
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default ConfiguratorPage;
