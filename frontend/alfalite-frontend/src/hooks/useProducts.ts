// filepath: frontend/alfalite-frontend/src/hooks/useProducts.ts

import { useState, useCallback } from "react";
import apiClient from "../api/apiClient";

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

  /**
   * Obtener todos los productos
   */
  const fetchAll = useCallback(async () => {
    setLoading(true);

    try {
      const res = await apiClient.get<Product[]>("/api/products");
      setProducts(res.data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear producto
   */
  const create = async (p: Product) => {
    try {
      const res = await apiClient.post<Product>("/api/products", p);
      const saved = res.data;

      setProducts((prev) => [...prev, saved]);

      return saved;
    } catch (err: any) {
      setError(err?.message || "Error creando producto");
      throw err;
    }
  };

  /**
   * Actualizar producto
   */
  const update = async (id: number, p: Partial<Product>) => {
    try {
      const res = await apiClient.patch<Product>(`/api/products/${id}`, p);
      const updated = res.data;

      setProducts((prev) => prev.map((x) => (x.id === id ? updated : x)));

      return updated;
    } catch (err: any) {
      setError(err?.message || "Error actualizando producto");
      throw err;
    }
  };

  /**
   * Eliminar producto
   */
  const remove = async (id: number) => {
    try {
      await apiClient.delete(`/api/products/${id}`);

      setProducts((prev) => prev.filter((x) => x.id !== id));
    } catch (err: any) {
      setError(err?.message || "Error eliminando producto");
      throw err;
    }
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
