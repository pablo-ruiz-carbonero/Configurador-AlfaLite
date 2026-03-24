import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";
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
import {
  sendQuoteRequest,
  type QuoteData,
  generatePdf,
  type PdfData,
} from "../api/products";

function ConfiguratorPage() {
  const { products, loading, getAll } = useProductsConfigurator();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();

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
    if (typeof arr === "string")
      return arr.toLowerCase().includes(val.toLowerCase());
    return arr.some((x) => x.toLowerCase().includes(val.toLowerCase()));
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
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const handleActionClick = (action: ModalAction) => {
    if (!selectedProduct || !stats) {
      showError(t("notSelectedProductError"));
      return;
    }
    setModalAction(action);
  };

  const handleFormSubmit = async (formData: any) => {
    if (!selectedProduct) {
      throw new Error("No product selected");
    }
    if (modalAction === "pdf") {
      try {
        const pdfData: PdfData = {
          productId: selectedProduct.id,
          tilesH,
          tilesV,
          unit,
        };
        const pdfBlob = await generatePdf(pdfData);

        // Crear URL del blob y descargar
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `led-configuration-${selectedProduct?.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showSuccess(t("pdfDownloaded"));
      } catch (error) {
        console.error("Error generating PDF:", error);
        showError(t("pdfFailed"));
      }
    } else if (modalAction === "quote") {
      try {
        const quoteData: QuoteData = {
          ...formData,
          productId: selectedProduct?.id,
          tilesH,
          tilesV,
          unit,
        };
        await sendQuoteRequest(quoteData);
        showSuccess(t("quoteSent"));
      } catch (error) {
        console.error("Error sending quote:", error);
        showError(t("quoteFailed"));
      }
    }
    setModalAction(null); // Cerramos el modal
  };

  const copyResultsToClipboard = () => {
    if (!selectedProduct || !stats) {
      showError(t("notSelectedProductError"));
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
        showSuccess(t("copied"));
        setTimeout(() => setCopyStatus("idle"), 1800);
      })
      .catch(() => {
        setCopyStatus("failed");
        showError(t("copyFailed"));
        setTimeout(() => setCopyStatus("idle"), 1800);
      });
  };

  return (
    <>
      <div className="title-row">
        <h1 className="page-title">{t("appTitle")}</h1>
      </div>

      <main className="configurator-container">
        <div className="cfg-grid">
          {/* 1. PRODUCT */}
          <aside className="cfg-panel panel-product">
            <div className="panel-header">
              <h3>{t("chooseProduct")}</h3>
            </div>
            <div className="panel-body">
              {loading ? (
                <div className="cfg-loading">{t("loading")}</div>
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
              <h3>{t("dimensions")}</h3>
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
                <p className="cfg-placeholder">{t("selectProductFirst")}</p>
              )}
            </div>
          </section>

          {/* 3. RESULTS */}
          <section className="cfg-panel panel-results">
            <div className="panel-header results-header-wrap">
              <h3>{t("results")}</h3>
              <div className="copy-action-wrap">
                <button
                  type="button"
                  className="btn-copy"
                  onClick={copyResultsToClipboard}
                >
                  {t("copyResults")}
                </button>
                <span className={`copy-feedback ${copyStatus}`}>
                  {copyStatus === "copied" && t("copied")}
                  {copyStatus === "failed" && t("copyFailed")}
                </span>
              </div>
            </div>
            <div className="panel-body">
              {selectedProduct && stats ? (
                <ResultsData product={selectedProduct} stats={stats} />
              ) : (
                <p className="cfg-placeholder">{t("noProductSelected")}</p>
              )}
            </div>
          </section>

          {/* 4. CANVAS */}
          <section className="cfg-panel panel-canvas">
            <div className="panel-header">
              <h3>{t("realTimeSimulator")}</h3>
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
                <p className="cfg-placeholder">{t("selectProductToPreview")}</p>
              )}
            </div>
          </section>
        </div>
        <div className="main-action-section">
          <button
            className="btn-action"
            onClick={() => handleActionClick("pdf")}
          >
            {t("saveAsPdf")}
          </button>
          <button
            className="btn-action btn-action-primary"
            onClick={() => handleActionClick("quote")}
          >
            {t("requestQuote")}
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
