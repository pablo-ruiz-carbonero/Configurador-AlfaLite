import { useState, useMemo } from "react";
import { type Product } from "./useProducts";

export const useConfigurator = () => {
  const [selectedProduct, _setSelectedProduct] = useState<Product | null>(null);
  const [cols, setCols] = useState(1);
  const [rows, setRows] = useState(1);

  // wrap setter so we can reset grid each time user picks a new model
  const setSelectedProduct = (p: Product | null) => {
    _setSelectedProduct(p);
    setCols(1);
    setRows(1);
  };

  const setColsWrapper = (n: number) => setCols(Math.max(0, n));
  const setRowsWrapper = (n: number) => setRows(Math.max(0, n));

  // Cálculos automáticos basados en el producto seleccionado
  const totals = useMemo(() => {
    if (!selectedProduct) return null;

    return {
      widthMm: cols * selectedProduct.width,
      heightMm: rows * selectedProduct.height,
      pixelsH: cols * selectedProduct.horizontal,
      pixelsV: rows * selectedProduct.vertical,
      totalWeight: (cols * rows * selectedProduct.weight).toFixed(2),
      totalConsumption: (cols * rows * selectedProduct.consumption).toFixed(2),
      totalCabinets: cols * rows,
    };
  }, [selectedProduct, cols, rows]);

  return {
    selectedProduct,
    setSelectedProduct,
    cols,
    setCols: setColsWrapper,
    rows,
    setRows: setRowsWrapper,
    totals,
  };
};
