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
  surface: number;
  surfaceUnit: string;
  weight: number;
  powerMax: number;
  powerAvg: number;
  btu: number;
  optViewDistance: number;
  dimUnit: string;
  depth: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateStats(
  product: Product,
  tilesH: number,
  tilesV: number,
  unit: Unit = "m",
): Stats {
  const totalTiles = tilesH * tilesV;

  // Physical size in meters
  const wM = (tilesH * product.width) / 1000;
  const hM = (tilesV * product.height) / 1000;

  const mToFt = 3.28084;
  const wFt = wM * mToFt;
  const hFt = hM * mToFt;

  const diagM = Math.sqrt(wM ** 2 + hM ** 2);

  // Resolution
  const resH = tilesH * product.horizontal;
  const resV = tilesV * product.vertical;
  const g = gcd(resH, resV);
  const aspect = resH > 0 && resV > 0 ? `${resH / g} : ${resV / g}` : "0 : 0";

  // Power: consumption is W/module → kW total
  const powerMaxKW = totalTiles * product.consumption;
  const powerAvgKW = powerMaxKW * 0.35;
  const btu = powerAvgKW * 3412.14;

  // Optimal view distance: pixelPitch mm = distance in meters (industry standard)
  const optDistM = product.pixelPitch;

  // Surface: original uses widthFt * heightM (mixed, to replicate exact numbers)
  const surfaceFt = wFt * hM;
  const surfaceM = wM * hM;

  const depthM = product.depth / 1000;

  if (unit === "ft") {
    return {
      totalTiles,
      widthM: wFt,
      heightM: hFt,
      diagonal: diagM * mToFt,
      resH,
      resV,
      aspect,
      surface: surfaceFt,
      surfaceUnit: "ft2",
      weight: totalTiles * product.weight,
      powerMax: powerMaxKW,
      powerAvg: powerAvgKW,
      btu,
      optViewDistance: optDistM * mToFt,
      dimUnit: "ft",
      depth: depthM * mToFt,
    };
  }

  return {
    totalTiles,
    widthM: wM,
    heightM: hM,
    diagonal: diagM,
    resH,
    resV,
    aspect,
    surface: surfaceM,
    surfaceUnit: "m²",
    weight: totalTiles * product.weight,
    powerMax: powerMaxKW,
    powerAvg: powerAvgKW,
    btu,
    optViewDistance: optDistM,
    dimUnit: "m",
    depth: depthM,
  };
}
