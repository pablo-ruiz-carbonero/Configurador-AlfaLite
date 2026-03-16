import { useRef, useEffect, useState } from "react";
import type { Product } from "../../types/product";
import type { Stats } from "../../utils/calculateStats";

interface ScreenCanvasProps {
  tilesH: number;
  tilesV: number;
  product: Product;
  stats: Stats;
  unit: "m" | "ft";
}

function ScreenCanvas({
  tilesH,
  tilesV,
  product,
  stats,
  unit,
}: ScreenCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 500, h: 300 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () =>
      setContainerSize({ w: el.clientWidth || 500, h: el.clientHeight || 300 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const u = unit === "ft" ? "ft" : "m";
  const LABEL_H = 22;
  const HUMAN_AREA_W = 50;
  const LABEL_V_W = 72;
  const PAD = 3;

  const availW = Math.max(containerSize.w - HUMAN_AREA_W - LABEL_V_W - 24, 80);
  const availH = Math.max(containerSize.h - LABEL_H - 16, 60);

  const totalWmm = tilesH * product.width;
  const totalHmm = tilesV * product.height;
  const aspect = totalWmm / totalHmm || 1;

  let sw: number, sh: number;
  if (aspect >= availW / availH) {
    sw = availW;
    sh = Math.round(availW / aspect);
  } else {
    sh = availH;
    sw = Math.round(availH * aspect);
  }

  // Minimum 2px per tile so they're always visible
  const tileW = Math.max(2, Math.floor((sw - PAD * 2) / tilesH));
  const tileH = Math.max(2, Math.floor((sh - PAD * 2) / tilesV));

  const HUMAN_H = Math.round(tileH * tilesV * 0.72);
  const humanW = Math.max(12, Math.round(HUMAN_H * 0.28));

  const tiles = Array.from({ length: tilesH * tilesV });

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Human silhouette */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          flexShrink: 0,
          height: tileH * tilesV + PAD * 2 + LABEL_H,
          paddingBottom: LABEL_H,
        }}
      >
        <svg
          width={humanW}
          height={HUMAN_H}
          viewBox="0 0 40 140"
          fill="#666"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="20" cy="12" rx="9" ry="11" />
          <path d="M10 30 Q8 60 7 90 Q6 105 10 120 Q14 130 20 130 Q26 130 30 120 Q34 105 33 90 Q32 60 30 30 Q25 24 20 24 Q15 24 10 30Z" />
          <path d="M10 32 Q2 55 1 75 Q3 80 8 75 Q12 55 14 38Z" />
          <path d="M30 32 Q38 55 39 75 Q37 80 32 75 Q28 55 26 38Z" />
        </svg>
      </div>

      {/* Screen grid + label */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${tilesH}, ${tileW}px)`,
            gridTemplateRows: `repeat(${tilesV}, ${tileH}px)`,
            gap: "2px",
            background: "#111",
            padding: `${PAD}px`,
            borderRadius: 3,
          }}
        >
          {tiles.map((_, i) => (
            <div
              key={i}
              style={{
                width: tileW,
                height: tileH,
                background: "#1a3a2a",
                boxShadow: "inset 0 0 0 0.5px #0a2a1a",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#666", textAlign: "center" }}>
          {tilesH} tiles / {stats.resH} px / {stats.widthM.toFixed(2)} {u}
        </div>
      </div>

      {/* Vertical label */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 4,
          fontSize: 11,
          color: "#666",
          whiteSpace: "nowrap",
          flexShrink: 0,
          paddingBottom: LABEL_H,
        }}
      >
        <span>{tilesV} tiles</span>
        <span>{stats.resV} px</span>
        <span>
          {stats.heightM.toFixed(2)} {u}
        </span>
      </div>
    </div>
  );
}

export default ScreenCanvas;
