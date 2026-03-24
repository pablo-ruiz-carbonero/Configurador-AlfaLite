import { useState, useEffect } from "react";
import type { Product } from "../../types/product";
import { useTranslation } from "react-i18next";

interface Props {
  tilesH: number;
  tilesV: number;
  setTilesH: (v: number) => void;
  setTilesV: (v: number) => void;
  unit: "m" | "ft";
  setUnit: (u: "m" | "ft") => void;
  product: Product | null;
}

type VerticalMode = "tiles" | "height" | "aspect";
type HorizontalMode = "tiles" | "width" | "surface" | "diagonal";

const FT_TO_M = 0.3048;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

function DimensionControls({
  tilesH,
  tilesV,
  setTilesH,
  setTilesV,
  unit,
  setUnit,
  product,
}: Props) {
  const [tilesHInput, setTilesHInput] = useState(String(tilesH));
  const [tilesVInput, setTilesVInput] = useState(String(tilesV));
  const [verticalMode, setVerticalMode] = useState<VerticalMode>("tiles");
  const [horizontalMode, setHorizontalMode] = useState<HorizontalMode>("tiles");
  const [aspectA, setAspectA] = useState(16);
  const [aspectB, setAspectB] = useState(9);
  const { t } = useTranslation();

  const toMm = (value: number) =>
    unit === "ft" ? (value / FT_TO_M) * 1000 : value * 1000;
  const fromMm = (valueMm: number) =>
    unit === "ft" ? (valueMm / 1000) * FT_TO_M : valueMm / 1000;

  const clamp = (v: number) => Math.min(100, Math.max(1, Math.round(v)));

  // Sin producto no convertible; mostramos tiles
  const effectiveProduct = product;

  useEffect(() => {
    if (verticalMode === "tiles") {
      setTilesVInput(String(tilesV));
    } else if (verticalMode === "height" && effectiveProduct) {
      const heightUnits = fromMm(tilesV * effectiveProduct.height);
      setTilesVInput(String(Math.round(heightUnits)));
    } else if (verticalMode === "aspect") {
      // Mantener proporción actual en A:B
      const divider = gcd(tilesH, tilesV);
      if (divider > 0) {
        setAspectA(Math.round(tilesH / divider));
        setAspectB(Math.round(tilesV / divider));
      }
      setTilesVInput(String(tilesV));
    }
  }, [tilesH, tilesV, verticalMode, effectiveProduct, unit]);

  useEffect(() => {
    if (horizontalMode === "tiles") {
      setTilesHInput(String(tilesH));
    } else if (horizontalMode === "width" && effectiveProduct) {
      const widthUnits = fromMm(tilesH * effectiveProduct.width);
      setTilesHInput(String(Math.round(widthUnits)));
    } else if (horizontalMode === "surface" && effectiveProduct) {
      const surfaceM2 =
        ((tilesH * effectiveProduct.width) / 1000) *
        ((tilesV * effectiveProduct.height) / 1000);
      const value = unit === "ft" ? surfaceM2 / FT_TO_M ** 2 : surfaceM2;
      setTilesHInput(String(Math.round(value)));
    } else if (horizontalMode === "diagonal" && effectiveProduct) {
      const wMm = tilesH * effectiveProduct.width;
      const hMm = tilesV * effectiveProduct.height;
      const dUnits = fromMm(Math.sqrt(wMm ** 2 + hMm ** 2));
      setTilesHInput(String(Math.round(dUnits)));
    }
  }, [tilesH, tilesV, horizontalMode, effectiveProduct, unit]);

  useEffect(() => {
    if (verticalMode !== "aspect") return;
    const divider = gcd(tilesH, tilesV);
    if (divider <= 0) return;
    setAspectA(Math.max(1, Math.min(100, Math.round(tilesH / divider))));
    setAspectB(Math.max(1, Math.min(100, Math.round(tilesV / divider))));
  }, [tilesH, tilesV, verticalMode]);

  const onVerticalChange = (raw: number) => {
    if (verticalMode === "tiles") {
      setTilesV(clamp(raw));
      return;
    }

    if (!effectiveProduct) return;

    if (verticalMode === "height") {
      const targetMm = toMm(raw);
      const desiredTilesV = clamp(targetMm / effectiveProduct.height);
      setTilesV(desiredTilesV);
      return;
    }

    if (verticalMode === "aspect") {
      if (raw <= 0) return;
      const desiredTilesV = clamp(tilesH / raw);
      setTilesV(desiredTilesV);
      return;
    }
  };

  const onHorizontalChange = (raw: number) => {
    if (horizontalMode === "tiles") {
      setTilesH(clamp(raw));
      return;
    }

    if (!effectiveProduct) return;

    if (horizontalMode === "width") {
      const targetMm = toMm(raw);
      const desiredTilesH = clamp(targetMm / effectiveProduct.width);
      setTilesH(desiredTilesH);
      return;
    }

    if (horizontalMode === "surface") {
      if (raw <= 0) return;
      const surfaceM2 = unit === "ft" ? raw * FT_TO_M * FT_TO_M : raw;
      const targetMm2 = surfaceM2 * 1_000_000;
      const tileAreaMm2 = effectiveProduct.width * effectiveProduct.height;
      const totalTiles = Math.max(1, targetMm2 / tileAreaMm2);
      const ratio = tilesH / Math.max(tilesV, 1);
      const newTilesH = clamp(Math.sqrt(totalTiles * ratio));
      const newTilesV = clamp(Math.sqrt(totalTiles / ratio));
      setTilesH(newTilesH);
      setTilesV(newTilesV);
      return;
    }

    if (horizontalMode === "diagonal") {
      if (raw <= 0) return;
      const diagMm = toMm(raw);
      const aspectRatio = tilesH / Math.max(tilesV, 1);
      const alpha = diagMm / Math.sqrt(aspectRatio ** 2 + 1);
      const widthMm = alpha * aspectRatio;
      const heightMm = alpha;
      const newTilesH = clamp(widthMm / effectiveProduct.width);
      const newTilesV = clamp(heightMm / effectiveProduct.height);
      setTilesH(newTilesH);
      setTilesV(newTilesV);
      return;
    }
  };

  return (
    <div className="dimension-sliders">
      {/* VERTICAL (Filas / Height / Aspect) */}
      <div className="slider-group">
        <select
          value={verticalMode}
          onChange={(e) => setVerticalMode(e.target.value as VerticalMode)}
        >
          <option value="tiles">{t("verticalTiles")}</option>
          <option value="height">{t("verticalHeight", { unit })}</option>
          <option value="aspect">{t("verticalAspect")}</option>
        </select>

        {verticalMode !== "aspect" ? (
          <div className="slider-row">
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={Number(tilesVInput) || 1}
              onChange={(e) => {
                const value = Math.round(Number(e.target.value));
                const filtered = Math.max(1, Math.min(100, value));
                setTilesVInput(String(filtered));
                onVerticalChange(filtered);
              }}
            />
            <input
              type="number"
              min={1}
              max={100}
              step={1}
              value={Number(tilesVInput) || 1}
              onChange={(e) => {
                const value = Math.round(Number(e.target.value));
                if (Number.isFinite(value)) {
                  const filtered = Math.max(1, Math.min(100, value));
                  setTilesVInput(String(filtered));
                  onVerticalChange(filtered);
                }
              }}
            />
          </div>
        ) : (
          <div className="slider-row" style={{ gap: 6 }}>
            <input
              type="number"
              min={1}
              max={100}
              step={1}
              value={aspectA}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(100, Math.round(Number(e.target.value))),
                );
                setAspectA(value);
                if (value > 0 && aspectB > 0) {
                  setTilesV(clamp(Math.round((tilesH * aspectB) / value)));
                }
              }}
            />
            <span style={{ color: "var(--text-main)" }}>
              {" "}
              {t("aspectSeparator")}{" "}
            </span>
            <input
              type="number"
              min={1}
              max={100}
              step={1}
              value={aspectB}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(100, Math.round(Number(e.target.value))),
                );
                setAspectB(value);
                if (aspectA > 0 && value > 0) {
                  setTilesV(clamp(Math.round((tilesH * value) / aspectA)));
                }
              }}
            />
          </div>
        )}
      </div>

      {/* HORIZONTAL (Columnas / Width / Surface / Diagonal) */}
      <div className="slider-group">
        <select
          value={horizontalMode}
          onChange={(e) => setHorizontalMode(e.target.value as HorizontalMode)}
        >
          <option value="tiles">{t("horizontalTiles")}</option>
          <option value="width">{t("horizontalWidth", { unit })}</option>
          <option value="surface">
            {t("horizontalSurface", {
              surfaceUnit: unit === "ft" ? "ft²" : "m²",
            })}
          </option>
          <option value="diagonal">{t("horizontalDiagonal", { unit })}</option>
        </select>
        <div className="slider-row">
          <input
            type="range"
            min={horizontalMode === "tiles" ? 1 : 0.5}
            max={horizontalMode === "tiles" ? 100 : 120}
            step={horizontalMode === "tiles" ? 1 : 0.1}
            value={Number(tilesHInput) || 0}
            onChange={(e) => {
              const value = Number(e.target.value);
              setTilesHInput(e.target.value);
              onHorizontalChange(value);
            }}
          />
          <input
            type="number"
            value={tilesHInput}
            onChange={(e) => {
              const value = Number(e.target.value);
              setTilesHInput(e.target.value);
              if (!Number.isNaN(value)) onHorizontalChange(value);
            }}
          />
        </div>
      </div>

      <div className="unit-selector">
        <label>
          <input
            type="radio"
            checked={unit === "m"}
            onChange={() => setUnit("m")}
          />
          {t("unitMeters")}
        </label>
        <label>
          <input
            type="radio"
            checked={unit === "ft"}
            onChange={() => setUnit("ft")}
          />
          {t("unitFeet")}
        </label>
      </div>
    </div>
  );
}

export default DimensionControls;
