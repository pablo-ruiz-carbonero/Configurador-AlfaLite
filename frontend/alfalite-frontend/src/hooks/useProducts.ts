import { useState, useCallback } from "react";
import * as productApi from "../api/products";
import type { Product } from "./useProductsWithCRUD";

export function useProductsConfigurator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts();
      setProducts(data || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Error desconocido");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, getAll };
}
