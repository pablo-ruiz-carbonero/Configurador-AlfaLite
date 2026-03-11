interface Props {
  tilesH: number;
  tilesV: number;
  setTilesH: (v: number) => void;
  setTilesV: (v: number) => void;
  unit: "m" | "ft";
  setUnit: (u: "m" | "ft") => void;
}

function DimensionControls({
  tilesH,
  tilesV,
  setTilesH,
  setTilesV,
  unit,
  setUnit,
}: Props) {
  return (
    <div className="dimension-sliders">
      {/* Grupo 1 */}
      <div className="slider-group">
        <select>
          <option value="Tiles vertical">Tiles vertical</option>
          <option value="Height">Height</option>
          <option value="Aspect ratio">Aspect ratio</option>
        </select>

        <div className="slider-row">
          <input
            type="range"
            min={1}
            max={100}
            value={tilesH}
            onChange={(e) => setTilesH(parseInt(e.target.value))}
          />
          <input
            type="number"
            min={1}
            max={100}
            value={tilesH}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setTilesH(1);
              else {
                const num = parseInt(val);
                if (!isNaN(num)) setTilesH(Math.min(Math.max(num, 1), 100));
              }
            }}
          />
        </div>
      </div>

      {/* Grupo 2 */}
      <div className="slider-group">
        <select>
          <option value="Tiles horizontal">Tiles horizontal</option>
          <option value="Width">Width</option>
          <option value="Surface">Surface</option>
          <option value="Diagonal">Diagonal</option>
        </select>

        <div className="slider-row">
          <input
            type="range"
            min={1}
            max={100}
            value={tilesV}
            onChange={(e) => setTilesV(parseInt(e.target.value))}
          />
          <input
            type="number"
            min={1}
            max={100}
            value={tilesV}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setTilesV(1);
              else {
                const num = parseInt(val);
                if (!isNaN(num)) setTilesV(Math.min(Math.max(num, 1), 100));
              }
            }}
          />
        </div>
      </div>

      {/* Radios Meters / Feet */}
      <div className="unit-selector">
        <label>
          <input
            type="radio"
            name="unit"
            value="m"
            checked={unit === "m"}
            onChange={() => setUnit("m")}
          />
          Meters
        </label>
        <label>
          <input
            type="radio"
            name="unit"
            value="ft"
            checked={unit === "ft"}
            onChange={() => setUnit("ft")}
          />
          Feet
        </label>
      </div>
    </div>
  );
}

export default DimensionControls;
