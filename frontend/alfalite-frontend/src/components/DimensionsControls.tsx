import { useState, useEffect } from "react";

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
  const [tilesHInput, setTilesHInput] = useState(String(tilesH));
  const [tilesVInput, setTilesVInput] = useState(String(tilesV));

  useEffect(() => setTilesHInput(String(tilesH)), [tilesH]);
  useEffect(() => setTilesVInput(String(tilesV)), [tilesV]);

  return (
    <div className="dimension-sliders">
      {/* VERTICAL */}
      <div className="slider-group">
        <select>
          <option>Tiles vertical</option>
          <option>Height</option>
          <option>Aspect ratio</option>
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
            value={tilesHInput}
            onChange={(e) => {
              const val = e.target.value;
              setTilesHInput(val);

              const num = parseInt(val);
              if (!isNaN(num)) {
                setTilesH(Math.min(Math.max(num, 1), 100));
              }
            }}
          />
        </div>
      </div>

      {/* HORIZONTAL */}
      <div className="slider-group">
        <select>
          <option>Tiles horizontal</option>
          <option>Width</option>
          <option>Surface</option>
          <option>Diagonal</option>
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
            value={tilesVInput}
            onChange={(e) => {
              const val = e.target.value;
              setTilesVInput(val);

              const num = parseInt(val);
              if (!isNaN(num)) {
                setTilesV(Math.min(Math.max(num, 1), 100));
              }
            }}
          />
        </div>
      </div>

      {/* UNITS */}
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
