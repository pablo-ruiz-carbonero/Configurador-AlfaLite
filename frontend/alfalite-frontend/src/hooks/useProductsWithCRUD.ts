import { useState, useCallback } from "react";
import * as productApi from "../api/productsWithCRUD";

/** * Interfaz de producto compartida con el backend. * Sólo se incluyen los campos que actualmente se usan en la UI. */ export interface Product {
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

  const getAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts();
      setProducts(data || []); // seguro que no es undefined
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Error desconocido");
      setProducts([]); // fallback seguro
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (product: Product) => {
    try {
      const saved = await productApi.createProduct(product);
      setProducts((prev) => [...prev, saved]);
      return saved;
    } catch (err: any) {
      setError(err?.message || "Error creando producto");
      throw err;
    }
  };

  const update = async (id: number, data: Partial<Product>) => {
    try {
      const updated = await productApi.updateProduct(id, data);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      setError(err?.message || "Error actualizando producto");
      throw err;
    }
  };

  const remove = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err?.message || "Error eliminando producto");
      throw err;
    }
  };

  return { products, loading, error, getAll, create, update, remove };
}
