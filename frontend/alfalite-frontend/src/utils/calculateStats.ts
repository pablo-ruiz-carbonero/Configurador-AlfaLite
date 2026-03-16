import type { Product } from "../types/product";

export type Unit = "m" | "ft";

export interface Stats {
  totalTiles: number;
  widthM: number;
  heightM: number;
  diagonal: number;
  resH: number;
  resV: number;
  aspect: string;
  area: number;
  weight: number;
  powerMax: number;
  powerAvg: number;
  btu: number;
}

function getGCD(a: number, b: number): number {
  return b === 0 ? a : getGCD(b, a % b);
}

export function calculateStats(
  product: Product,
  tilesH: number,
  tilesV: number,
  unit: Unit = "m",
): Stats {
  const totalTiles = tilesH * tilesV;

  // Dimensiones base en metros
  const widthBaseM = (tilesH * product.width) / 1000;
  const heightBaseM = (tilesV * product.height) / 1000;

  const diagonalM = Math.sqrt(widthBaseM ** 2 + heightBaseM ** 2);
  const areaM = widthBaseM * heightBaseM;

  const resH = tilesH * product.horizontal;
  const resV = tilesV * product.vertical;

  // Aspect Ratio corregido (Horizontal : Vertical)
  const common = getGCD(resH, resV);
  const aspect =
    resH > 0 && resV > 0 ? `${resH / common} : ${resV / common}` : "0 : 0";

  const powerMax = totalTiles * product.consumption;

  const mToFt = 3.28084;
  const m2ToFt2 = 10.7639; // Factor real m² a ft²

  return {
    totalTiles,
    widthM: unit === "ft" ? widthBaseM * mToFt : widthBaseM,
    heightM: unit === "ft" ? heightBaseM * mToFt : heightBaseM,
    diagonal: unit === "ft" ? diagonalM * mToFt : diagonalM,
    resH,
    resV,
    aspect,
    area: unit === "ft" ? areaM * m2ToFt2 : areaM,
    weight: totalTiles * product.weight,
    powerMax: powerMax,
    powerAvg: powerMax * 0.35,
    btu: powerMax * 3412.14, // BTU/h
  };
}
