import apiClient from "./apiClient";
import type { Product } from "../types/product";

// El interceptor de apiClient ya devuelve response.data directamente.
// Por eso NO hay que hacer .data — el resultado ya es el payload.

export const getProducts = async (): Promise<Product[]> => {
  return apiClient.get("/api/dashboard/products") as unknown as Promise<
    Product[]
  >;
};

export const createProduct = async (product: Product): Promise<Product> => {
  return apiClient.post(
    "/api/dashboard/products",
    product,
  ) as unknown as Promise<Product>;
};

export const updateProduct = async (
  id: number,
  data: Partial<Product>,
): Promise<Product> => {
  return apiClient.patch(
    `/api/dashboard/products/${id}`,
    data,
  ) as unknown as Promise<Product>;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/dashboard/products/${id}`);
};
