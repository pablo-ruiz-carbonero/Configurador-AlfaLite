// filepath: src/utils/calculateStats.ts
import type { Product } from "../hooks/useProducts";

export type Unit = "m" | "ft";

export interface Stats {
  totalTiles: number;
  widthM: number; // ancho en metros o feet según unidad
  heightM: number; // alto en metros o feet según unidad
  diagonal: number; // diagonal en metros o feet
  resH: number; // resolución horizontal total
  resV: number; // resolución vertical total
  aspect: string; // relación de aspecto
  area: number; // superficie total en m² o ft²
  weight: number; // peso total en kg
  powerMax: number; // consumo máximo en kW
  powerAvg: number; // consumo promedio en kW
  btu: number; // consumo en BTU
}

export function calculateStats(
  product: Product,
  tilesH: number,
  tilesV: number,
  unit: Unit = "m",
): Stats {
  const totalTiles = tilesH * tilesV;

  // tamaño en metros
  const widthM = (tilesH * product.width) / 1000;
  const heightM = (tilesV * product.height) / 1000;

  // resolución total
  const resH = tilesH * product.horizontal;
  const resV = tilesV * product.vertical;

  // relación de aspecto
  const aspect = (resH / resV).toFixed(2);

  // superficie y diagonal
  const area = widthM * heightM;
  const diagonal = Math.sqrt(widthM ** 2 + heightM ** 2);

  // peso y consumo
  const weight = totalTiles * product.weight;
  const powerMax = totalTiles * product.consumption;
  const powerAvg = powerMax * 0.35;
  const btu = powerMax * 3.412;

  // factor de conversión a pies
  const factor = unit === "ft" ? 3.28084 : 1;

  return {
    totalTiles,
    widthM: widthM * factor,
    heightM: heightM * factor,
    diagonal: diagonal * factor,
    resH,
    resV,
    aspect,
    area: area * factor ** 2,
    weight,
    powerMax,
    powerAvg,
    btu,
  };
}
