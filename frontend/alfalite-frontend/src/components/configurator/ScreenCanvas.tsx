import type { Product } from "../hooks/useProducts";

interface ScreenCanvasProps {
  tilesH: number;
  tilesV: number;
  product: Product;
  image?: string;
}

function ScreenCanvas({
  tilesH,
  tilesV,
  product,
  image = "/demo-led.jpg",
}: ScreenCanvasProps) {
  const tiles = Array.from({ length: tilesH * tilesV });

  const wallWidth = tilesH * product.width;
  const wallHeight = tilesV * product.height;
  const aspectRatio = wallWidth / wallHeight;

  return (
    <div className="canvas-wrapper">
      <div
        className="screen-grid"
        style={{
          aspectRatio: aspectRatio,
          gridTemplateColumns: `repeat(${tilesH}, 1fr)`,
          gridTemplateRows: `repeat(${tilesV}, 1fr)`,
        }}
      >
        {tiles.map((_, index) => {
          const col = index % tilesH;
          const row = Math.floor(index / tilesH);

          return (
            <div
              key={index}
              className="tile"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${tilesH * 100}% ${tilesV * 100}%`,
                backgroundPosition: `${(col * 100) / (tilesH - 1 || 1)}% ${(row * 100) / (tilesV - 1 || 1)}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ScreenCanvas;
