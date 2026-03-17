import type { Product } from "../../types/product";
import type { Stats } from "../../utils/calculateStats";
import mujer from "../../assets/woman.png";
import tileImg from "../../assets/fotoDeEjemplo.jpg";

interface ScreenCanvasProps {
  tilesH: number;
  tilesV: number;
  product: Product;
  stats: Stats;
  unit: "m" | "ft";
}

const WOMAN_REAL_MM = 1700;
const WOMAN_ASPECT = 0.38;

function ScreenCanvas({
  tilesH,
  tilesV,
  product,
  stats,
  unit,
}: ScreenCanvasProps) {
  const CW = 760;
  const CH = 360;

  const GAP = 16; // gap fijo entre mujer y pantalla
  const LR = 72; // etiqueta lateral derecha
  const LB = 36; // etiqueta inferior
  const PAD = 20; // padding mínimo en bordes

  const screenW_mm = tilesH * product.width;
  const screenH_mm = tilesV * product.height;
  const womanW_mm = WOMAN_REAL_MM * WOMAN_ASPECT;

  // availW y availH son el espacio MÁXIMO que puede ocupar el conjunto escalado
  // Se restan los elementos fijos que nunca escalan
  const availW = CW - PAD * 2 - GAP - LR;
  const availH = CH - PAD * 2 - LB;

  const scale = Math.min(
    availW / (womanW_mm + screenW_mm),
    availH / Math.max(WOMAN_REAL_MM, screenH_mm),
  );

  const pxWomanH = WOMAN_REAL_MM * scale;
  const pxWomanW = womanW_mm * scale;
  const pxScreenW = screenW_mm * scale;
  const pxScreenH = screenH_mm * scale;
  const tileW = pxScreenW / (tilesH || 1);
  const tileH = pxScreenH / (tilesV || 1);

  // Ancho y alto total del bloque visual (sin etiquetas fijas)
  const blockW = pxWomanW + GAP + pxScreenW;
  const blockH = Math.max(pxWomanH, pxScreenH);

  // Centrado: el bloque + etiquetas cabe siempre dentro de CW/CH
  // Left: centra el bloque + LR dentro del canvas
  const left = (CW - blockW - LR) / 2;
  // Top: alinea el bloque + LB al centro vertical
  // La base del bloque estará en: top + blockH
  // Queremos que top + blockH + LB quede centrado verticalmente
  const top = (CH - blockH - LB) / 2;

  const u = unit === "ft" ? "ft" : "m";

  return (
    <div
      style={{
        width: CW,
        height: CH,
        minWidth: CW,
        maxWidth: CW,
        minHeight: CH,
        maxHeight: CH,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Mujer — posicionada absolutamente, pies en la misma línea que la base de la pantalla */}
      <img
        src={mujer}
        alt="Referencia humana"
        style={{
          position: "absolute",
          left: left,
          // "top" de la mujer = top del bloque + (blockH - pxWomanH)
          // así sus pies quedan exactamente en top + blockH
          top: top + (blockH - pxWomanH),
          width: pxWomanW,
          height: pxWomanH,
          objectFit: "contain",
          flexShrink: 0,
          transition: "all 0.3s ease",
        }}
      />

      {/* Pantalla + etiqueta inferior */}
      <div
        style={{
          position: "absolute",
          left: left + pxWomanW + GAP,
          top: top + (blockH - pxScreenH), // pies/base de pantalla en top + blockH
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${tilesH}, ${tileW}px)`,
            gridTemplateRows: `repeat(${tilesV}, ${tileH}px)`,
            gap: tileW > 5 && tileH > 5 ? "1px" : "0px",
            background: "#000",
            padding: "2px",
            border: "1.5px solid #333",
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        >
          {Array.from({ length: tilesH * tilesV }).map((_, i) => {
            const row = Math.floor(i / tilesH);
            const col = i % tilesH;
            return (
              <div
                key={i}
                style={{
                  width: tileW,
                  height: tileH,
                  backgroundImage: `url(${tileImg})`,
                  backgroundSize: `${pxScreenW}px ${pxScreenH}px`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${-col * tileW}px ${-row * tileH}px`,
                  filter: "brightness(0.85)",
                }}
              />
            );
          })}
        </div>

        {/* Etiqueta anchura */}
        <div style={{ marginTop: 5, textAlign: "center", lineHeight: 1.3 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: "bold",
              color: "var(--primary)",
            }}
          >
            {stats.widthM.toFixed(2)} {u}
          </div>
          <div style={{ fontSize: 9, color: "var(--text-secondary)" }}>
            {tilesH} tiles
          </div>
        </div>
      </div>

      {/* Etiqueta altura — centrada verticalmente respecto a la pantalla */}
      <div
        style={{
          position: "absolute",
          left: left + pxWomanW + GAP + pxScreenW + 10,
          // centrada en la pantalla
          top: top + (blockH - pxScreenH) + pxScreenH / 2 - 16,
          borderLeft: "1px solid var(--text-main)",
          paddingLeft: 8,
          lineHeight: 1.4,
        }}
      >
        <div
          style={{ fontSize: 11, fontWeight: "bold", color: "var(--primary)" }}
        >
          {stats.heightM.toFixed(2)} {u}
        </div>
        <div style={{ fontSize: 9, color: "var(--text-main)" }}>
          {tilesV} tiles
        </div>
      </div>
    </div>
  );
}

export default ScreenCanvas;
