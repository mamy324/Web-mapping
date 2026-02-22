import { Layers } from "lucide-react";
import { BASEMAPS } from "./Basemaps";
import "./MapControls.css";

export default function MapControls({ selectedBasemap, onBasemapChange }) {
  return (
    <div className="bottom-right-controls">
      <div className="basemap-control">
        <Layers size={18} />
        <select
          value={selectedBasemap}
          onChange={(e) => onBasemapChange(e.target.value)}
        >
          {Object.entries(BASEMAPS).map(([key, bm]) => (
            <option key={key} value={key}>
              {bm.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
