import React, { useState, useEffect } from "react";
import "./Configurator.css";
import { useProducts, type Product } from "../hooks/useProducts";
import ProductList from "../components/ProductList";
import ProductFilters from "../components/ProductFilters";
import DimensionControls from "../components/DimensionsControls";

function ConfiguradorPage() {
  const { products, loading, fetchAll } = useProducts();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const [filters, setFilters] = useState({
    location: "All",
    application: "All",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [tilesH, setTilesH] = useState(4);
  const [tilesV, setTilesV] = useState(3);

  if (loading) return <div className="loading">Cargando configurador...</div>;

  const contains = (arr: string[] | undefined, val: string) => {
    if (!arr || val === "All") return true;
    return arr.some((x) => x.toLowerCase() === val.toLowerCase());
  };

  const filteredProducts = products.filter((p) => {
    return (
      contains(p.location, filters.location) &&
      contains(p.application, filters.application)
    );
  });

  return (
    <>
      <h2>Led Screen Configurator</h2>

      <main className="container">
        <div className="grid">
          <aside className="config-panel left-panel glass-panel ContainerChooseAProduct">
            <div className="panel-header">
              <h2>Configuración</h2>
            </div>

            <div className="panel-content">
              <ProductFilters filters={filters} setFilters={setFilters} />

              <ProductList
                products={filteredProducts}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
              />
            </div>
          </aside>
          <section className="Dimensions">
            <p>Dimensions</p>
            {selectedProduct && (
              <DimensionControls
                tilesH={tilesH}
                tilesV={tilesV}
                setTilesH={setTilesH}
                setTilesV={setTilesV}
              />
            )}
          </section>

          <section className="Results">
            <p>Results</p>
          </section>

          <section className="Canvas">
            <p>Canvas</p>
          </section>
        </div>
      </main>
    </>
  );
}

export default ConfiguradorPage;
