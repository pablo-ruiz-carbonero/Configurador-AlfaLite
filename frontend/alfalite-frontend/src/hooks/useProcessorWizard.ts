import { useState, useCallback } from "react";
import apiClient from "../api/apiClient";

export interface ScreenData {
  width: number;
  height: number;
  physicalWidth: number;
  physicalHeight: number;
  pixelPitch?: number;
}

export interface CalculationRequest {
  screenData: ScreenData;
  selectedBrand: "NovaStar" | "Brompton";
  selectedApplications: string[];
  selectedMainInputType: string;
  selectedAuxiliaryInputs: Record<string, number>;
  selectedOutputType: "RJ45" | "OpticalFiber";
  selectedAuxiliaryOutputs: Record<string, number>;
  bromptonConfig?: any;
  novastarConfig?: any;
}

export interface Processor {
  id: string;
  name: string;
  brand: "NovaStar" | "Brompton";
  model: string;
  maxPixels: number;
  cost: number;
  features: string[];
  supportedResolutions: string[];
  frameRates: number[];
  bitDepths: number[];
}

export interface ConfigurationSolution {
  id: string;
  rank: number;
  processors: Processor[];
  inputCards: any[];
  outputCards: any[];
  totalCost: number;
  costBreakdown: Record<string, number>;
  solutionType: string;
  summary: string;
  advantages: string[];
  considerations: string[];
  metadata: Record<string, any>;
}

export const useProcessorWizard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<ConfigurationSolution[]>([]);
  const [selectedSolution, setSelectedSolution] =
    useState<ConfigurationSolution | null>(null);

  const calculateSolutions = useCallback(
    async (request: CalculationRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<ConfigurationSolution[]>(
          "/processor/calculate",
          request,
        );
        setSolutions(response.data);
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to calculate solutions";
        setError(errorMessage);
        console.error("Error calculating solutions:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const selectSolution = useCallback((solution: ConfigurationSolution) => {
    setSelectedSolution(solution);
  }, []);

  const sendConfigurationEmail = useCallback(
    async (email: string, screenSpecs: any) => {
      if (!selectedSolution) {
        throw new Error("No solution selected");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post("/processor/send-email", {
          email,
          solution: selectedSolution,
          screenSpecs,
        });
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to send email";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedSolution],
  );

  const sendQuoteRequest = useCallback(
    async (email: string, screenSpecs: any) => {
      if (!selectedSolution) {
        throw new Error("No solution selected");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post("/processor/quote-request", {
          email,
          solutionId: selectedSolution.id,
          screenSpecs,
        });
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to send quote request";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedSolution],
  );

  return {
    loading,
    error,
    solutions,
    selectedSolution,
    calculateSolutions,
    selectSolution,
    sendConfigurationEmail,
    sendQuoteRequest,
  };
};
