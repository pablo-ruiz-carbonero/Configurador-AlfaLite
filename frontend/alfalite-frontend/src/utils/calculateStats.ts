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

  // dimensiones base en metros
  const widthM = (tilesH * product.width) / 1000;
  const heightM = (tilesV * product.height) / 1000;

  const diagonalM = Math.sqrt(widthM ** 2 + heightM ** 2);
  const areaM = widthM * heightM;

  const resH = tilesH * product.horizontal;
  const resV = tilesV * product.vertical;

  const aspect = (resH / resV).toFixed(2);

  const weight = totalTiles * product.weight;
  const powerMax = totalTiles * product.consumption;
  const powerAvg = powerMax * 0.35;
  const btu = powerMax * 3.412;

  // conversión
  const mToFt = 3.28084;

  const width = unit === "ft" ? widthM * mToFt : widthM;
  const height = unit === "ft" ? heightM * mToFt : heightM;
  const diagonal = unit === "ft" ? diagonalM * mToFt : diagonalM;
  const area = unit === "ft" ? areaM * mToFt * mToFt : areaM;

  return {
    totalTiles,
    widthM: width,
    heightM: height,
    diagonal,
    resH,
    resV,
    aspect,
    area,
    weight,
    powerMax,
    powerAvg,
    btu,
  };
}
