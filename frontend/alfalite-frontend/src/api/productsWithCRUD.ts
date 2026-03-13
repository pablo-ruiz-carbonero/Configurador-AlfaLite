import apiClient from "./apiClient";
import type { Product } from "../hooks/useProductsWithCRUD";

export const getProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>("/api/dashboard/products");
  return res.data; // aquí sí usamos .data porque el interceptor devuelve todo AxiosResponse
};

export const createProduct = async (product: Product): Promise<Product> => {
  const res = await apiClient.post<Product>("/api/dashboard/products", product);
  return res.data;
};

export const updateProduct = async (
  id: number,
  data: Partial<Product>,
): Promise<Product> => {
  const res = await apiClient.patch<Product>(
    `/api/dashboard/products/${id}`,
    data,
  );
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/dashboard/products/${id}`);
};
