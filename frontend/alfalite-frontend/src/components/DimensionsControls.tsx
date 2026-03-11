interface Props {
  tilesH: number;
  tilesV: number;
  setTilesH: (v: number) => void;
  setTilesV: (v: number) => void;
}

function DimensionControls({ tilesH, tilesV, setTilesH, setTilesV }: Props) {
  return (
    <div className="dimension-sliders">
      <div className="slider-group">
        <label>Ancho (Tiles: {tilesH})</label>
        <input
          type="range"
          min="1"
          max="30"
          value={tilesH}
          onChange={(e) => setTilesH(parseInt(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <label>Alto (Tiles: {tilesV})</label>
        <input
          type="range"
          min="1"
          max="30"
          value={tilesV}
          onChange={(e) => setTilesV(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}

export default DimensionControls;
