// ScreenCanvas.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Previsualización a escala de una pantalla LED junto a una silueta humana.
//
// Layout:
//   ┌──────────────────────────────────────┬──────────┐
//   │                                      │  N tiles │
//   │   [mujer]    [pantalla]              │  XXX px  │ ← label derecha
//   │                                      │  X.XX m  │
//   ├──────────────────────────────────────┴──────────┤
//   │         N tiles / XXX px / X.XX m               │ ← label inferior
//   └─────────────────────────────────────────────────┘
//
// Es 100% responsive: mide el ancho real del contenedor con ResizeObserver
// y recalcula la escala al vuelo. Nunca se corta ni en pantallas pequeñas.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from "react";
import type { Product } from "../../types/product";
import type { Stats }   from "../../utils/calculateStats";
import mujer   from "../../assets/woman-white.png";
import tileImg from "../../assets/fotoDeEjemplo.jpg";

// ── Props ─────────────────────────────────────────────────────────────────────

interface ScreenCanvasProps {
  tilesH:  number;
  tilesV:  number;
  product: Product;
  stats:   Stats;
  unit:    "m" | "ft";
}

// ── Constantes configurables ──────────────────────────────────────────────────

const CANVAS_H    = 270;   // alto fijo del canvas en px (el ancho es flexible)

const WOMAN_H_MM  = 1700;  // altura real de la silueta en mm
const WOMAN_ASPECT = 0.38; // ratio ancho/alto de la imagen de la mujer

const GAP_PX      = 20;    // espacio horizontal entre mujer y pantalla
const LABEL_R_PX  = 110;   // ancho reservado a la derecha para la etiqueta de altura
const SCENE_TOP   = 10;    // margen superior de la escena
const SCENE_BOT   = 40;    // margen inferior (espacio para etiqueta de anchura)
const ZOOM        = 0.85;  // zoom global (1 = ocupa todo el espacio disponible)

// ─────────────────────────────────────────────────────────────────────────────

function ScreenCanvas({ tilesH, tilesV, product, stats, unit }: ScreenCanvasProps) {
  const u = unit === "ft" ? "ft" : "m";

  // ── Medir el ancho real del contenedor ─────────────────────────────────────
  // Empieza con 760 como valor inicial y se actualiza al montar y al redimensionar.
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

    if (containerW === 0) {
    return (
      <div
        ref={containerRef}
        style={{ width: "100%", height: CANVAS_H }}
      />
    );
  }

  // ── 1. Medidas reales en mm ─────────────────────────────────────────────────
  const screenW_mm = tilesH * product.width;
  const screenH_mm = tilesV * product.height;
  const womanW_mm  = WOMAN_H_MM * WOMAN_ASPECT;

  // ── 2. Tamaño real de la escena en px ──────────────────────────────────────
  // sceneW usa containerW (ancho medido), no un valor fijo.
  // Así la escala se adapta automáticamente a cualquier tamaño de pantalla.
  const sceneH = CANVAS_H - SCENE_TOP - SCENE_BOT;
  const sceneW = containerW - LABEL_R_PX;

  // ── 3. Escala: la más restrictiva entre ancho y alto, luego zoom ────────────
  // GAP_PX se resta de sceneW porque es fijo en px (no escala con mm).
  const scale = Math.min(
    (sceneW - GAP_PX) / (womanW_mm + screenW_mm),
    sceneH / Math.max(WOMAN_H_MM, screenH_mm),
  ) * ZOOM;

  // ── 4. Convertir mm → px ────────────────────────────────────────────────────
  const pxWomanW  = womanW_mm  * scale;
  const pxWomanH  = WOMAN_H_MM * scale;
  const pxScreenW = screenW_mm * scale;
  const pxScreenH = screenH_mm * scale;
  const pxTileW   = pxScreenW / (tilesH || 1);
  const pxTileH   = pxScreenH / (tilesV || 1);

  // ── 5. Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{
        position : "relative",
        width    : "100%",   // flexible: se adapta al contenedor padre
        height   : CANVAS_H,
        overflow : "hidden",
      }}
    >

      {/*
        ESCENA: top y bottom explícitos → altura fija = sceneH.
        La escala se calculó sobre sceneH y sceneW, así que
        mujer y pantalla siempre caben sin cortarse.
        alignItems: flex-end → ambas alineadas en la base.
      */}
      <div
        style={{
          position       : "absolute",
          top            : SCENE_TOP,
          bottom         : SCENE_BOT,
          left           : 0,
          right          : LABEL_R_PX,
          display        : "flex",
          alignItems     : "flex-end",
          justifyContent : "center",
          gap            : GAP_PX,
          overflow       : "hidden",
        }}
      >
        {/* Silueta humana de referencia */}
        <img
          src={mujer}
          alt="Referencia humana"
          style={{
            width          : pxWomanW,
            height         : pxWomanH,
            objectFit      : "contain",
            objectPosition : "bottom",
            flexShrink     : 0,
            transition     : "all 0.3s ease",
          }}
        />

        {/* Pantalla LED: grid de tiles */}
        <div
          style={{
            display             : "grid",
            gridTemplateColumns : `repeat(${tilesH}, ${pxTileW}px)`,
            gridTemplateRows    : `repeat(${tilesV}, ${pxTileH}px)`,
            gap                 : pxTileW > 8 && pxTileH > 8 ? "1px" : "0px",
            padding             : "2px",
            border              : "1px solid #333",
            flexShrink          : 0,
            transition          : "all 0.3s ease",
          }}
        >
          {Array.from({ length: tilesH * tilesV }).map((_, i) => {
            const row = Math.floor(i / tilesH);
            const col = i % tilesH;
            return (
              <div
                key={i}
                style={{
                  width              : pxTileW,
                  height             : pxTileH,
                  backgroundImage    : `url(${tileImg})`,
                  backgroundSize     : `${pxScreenW}px ${pxScreenH}px`,
                  backgroundRepeat   : "no-repeat",
                  // Desplaza la imagen para que cada tile muestre su fragmento correcto
                  backgroundPosition : `${-col * pxTileW}px ${-row * pxTileH}px`,
                  filter             : "brightness(0.9)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Etiqueta inferior: anchura de la pantalla */}
      <div
        style={{
          position  : "absolute",
          bottom    : 10,
          left      : 0,
          right     : LABEL_R_PX,
          textAlign : "center",
          fontSize  : 12,
          color     : "var(--text-main)",
        }}
      >
        {tilesH} tiles / {stats.resH} px / {stats.widthM.toFixed(2)} {u}
      </div>

      {/* Etiqueta lateral derecha: altura de la pantalla */}
      <div
        style={{
          position   : "absolute",
          right      : 12,
          top        : "50%",
          transform  : "translateY(-50%)",
          width      : LABEL_R_PX - 16,
          textAlign  : "right",
          fontSize   : 12,
          color      : "var(--text-main)",
          lineHeight : 1.7,
        }}
      >
        {tilesV} tiles<br />
        {stats.resV} px<br />
        {stats.heightM.toFixed(2)} {u}
      </div>

    </div>
  );
}

export default ScreenCanvas;