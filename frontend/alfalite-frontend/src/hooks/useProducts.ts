// filepath: frontend/alfalite-frontend/src/hooks/useProducts.ts
import { useState, useCallback } from "react";
import { apiFetch } from "../services/apiClient";

/**
 * Interfaz de producto compartida con el backend.
 * Sólo se incluyen los campos que actualmente se usan en la UI.
 */
export interface Product {
  id?: number;
  name: string;
  location: string[];
  application: string[];
  horizontal: number;
  vertical: number;
  pixelPitch: number;
  width: number;
  height: number;
  depth: number;
  consumption: number;
  weight: number;
  brightness: number;
  refreshRate?: number;
  contrast?: string;
  visionAngle?: string;
  redundancy?: string;
  curvedVersion?: string;
  opticalMultilayerInjection?: string;
  image?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Product[]>("/api/products");
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (p: Product) => {
    const saved = await apiFetch<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(p),
    });
    setProducts((prev) => [...prev, saved]);
    return saved;
  };

  const update = async (id: number, p: Partial<Product>) => {
    const updated = await apiFetch<Product>(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(p),
    });
    setProducts((prev) => prev.map((x) => (x.id === id ? updated : x)));
    return updated;
  };

  const remove = async (id: number) => {
    await apiFetch<void>(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((x) => x.id !== id));
  };

  return {
    products,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}
