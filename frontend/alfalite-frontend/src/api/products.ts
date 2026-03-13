import apiClientPublic from "./apiClientPublic";
import type { Product } from "../hooks/useProductsWithCRUD";

// Usamos el cliente público: ya devuelve directamente el array
export const getProducts = async (): Promise<Product[]> => {
  return await apiClientPublic.get("/api/configurator/products");
};
