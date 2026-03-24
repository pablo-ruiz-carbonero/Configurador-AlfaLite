import apiClientPublic from "./apiClientPublic";
import axios from "axios";
import type { Product } from "../types/product";

// Usamos el cliente público: ya devuelve directamente el array
export const getProducts = async (): Promise<Product[]> => {
  return await apiClientPublic.get("/api/configurator/products");
};

export interface QuoteData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  project: string;
  assembly: string;
  productId: number;
  tilesH: number;
  tilesV: number;
  unit: string;
}

export const sendQuoteRequest = async (
  quoteData: QuoteData,
): Promise<{ message: string }> => {
  return await apiClientPublic.post("/api/configurator/quote", quoteData);
};

export interface PdfData {
  productId: number | undefined;
  tilesH: number;
  tilesV: number;
  unit: string;
}

export const generatePdf = async (pdfData: PdfData): Promise<Blob> => {
  const response = await axios.post(
    `${apiClientPublic.defaults.baseURL}/api/configurator/pdf`,
    pdfData,
    {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};
