import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Sidebar from "../components/layout/Sidebar";
import { BASEMAPS } from "../components/fond/Basemaps";
import "./Map.css";

function MapInvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize({ animate: false }), 350);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function BasemapSelector({ selectedBasemap, onChange }) {
  return (
    <div className="basemap-selector-wrapper">
      <div className="basemap-selector-inner">
        <span className="basemap-icon">🗺️</span>
        <select value={selectedBasemap} onChange={(e) => onChange(e.target.value)}>
          {Object.entries(BASEMAPS).map(([key, bm]) => (
            <option key={key} value={key}>{bm.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function MapView() {

  const [data, setData] = useState(null);
  const [maxTotal, setMaxTotal] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtered, setFiltered] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("osm");

  const API_URL = "http://localhost:8000/api/countries";

  const fetchData = () => {

    const params = new URLSearchParams();

    if (maxTotal !== "" && !isNaN(maxTotal)) {
      params.append("max", Number(maxTotal));
    }

    params.append("_ts", Date.now());

    fetch(`${API_URL}?${params.toString()}`)
      .then(res => res.json())
      .then(json => {

        const maxValue = maxTotal !== "" ? Number(maxTotal) : null;

        const processed = {
          ...json,
          features: json.features.map(f => {

            const total = Number(f.properties?.total || 0);

            return {
              ...f,
              properties: {
                ...f.properties,
                match: maxValue === null || total <= maxValue
              }
            };
          })
        };

        setData(processed);
        setFiltered(maxValue !== null);
      })
      .catch(err => console.error(err));
  };

  // 🔥 FILTRE AUTOMATIQUE (correction ici seulement)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 300); // petit délai pour éviter trop de requêtes

    return () => clearTimeout(delay);
  }, [maxTotal]);

  const getColor = (total)    => {
    if (total > 2000) return "#800026";
    if (total > 1000) return "#BD0026";
    if (total > 500) return "#E31A1C";
    if (total > 100) return "#FC4E2A";
    if (total > 50 ) return "#FD8D3C";
    if (total >= 1) return "#FEB24C";
    return "#FFF7BC";
  };

  const geoStyle = (feature) => {

    const total = Number(feature.properties.total || 0);

    if (filtered && !feature.properties.match) {
      return {
        fillColor: "transparent",
        fillOpacity: 0,
        color: "white",
        weight: 1,
        opacity: 1
      };
    }

    return {
      fillColor: getColor(total),
      weight: 1,
      color: "white",
      fillOpacity: 0.7,
      opacity: 1,
    };
  };

  const onEachFeature = (feature, layer) => {

    const props = feature.properties || {};
    const total = Number(props.total || 0);

    layer.bindPopup(`
      <strong>${props.adresse || "Inconnu"}</strong><br/>
      <hr/>
      Total : ${props.total ?? 0}<br/>
      Femmes : ${props.femme ?? 0}<br/>
      Hommes : ${props.homme ?? 0}<br/>
      <hr/>
      L1 : ${props.licence1 ?? 0}<br/>
      L2 : ${props.licence2 ?? 0}<br/>
      L3 : ${props.licence3 ?? 0}<br/>
      M1 : ${props.master1 ?? 0}<br/>
      M2 : ${props.master2 ?? 0}
    `);

    if (filtered && feature.properties.match && total > 0) {
      layer.bindTooltip(`${total}`, {
        permanent: true,
        direction: "center",
        className: "population-tooltip",
      });
    }
  };

  return (
    <div className="app-container">

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        maxTotal={maxTotal}
        setMaxTotal={setMaxTotal}
        onApply={fetchData}
      />

      <div className={`map-wrapper ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

        <BasemapSelector
          selectedBasemap={selectedBasemap}
          onChange={setSelectedBasemap}
        />

        <MapContainer
          center={[-21.453, 47.086]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <ZoomControl position="topleft" />

          <TileLayer
            key={selectedBasemap}
            url={BASEMAPS[selectedBasemap]?.url}
            attribution={BASEMAPS[selectedBasemap]?.attribution}
          />

          <MapInvalidateSize />

          {data && (
            <GeoJSON
              key={JSON.stringify(data)}
              data={data}
              style={geoStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>

        <div className="legend-container">
          <div className="legend">
            <h4>Population Etudiantes</h4>
            <div className="legend-item"><span style={{ backgroundColor: "#800026" }}></span> &gt;2000</div>
            <div className="legend-item"><span style={{ backgroundColor: "#BD0026" }}></span> 1001 – 2000</div>
            <div className="legend-item"><span style={{ backgroundColor: "#E31A1C" }}></span> 151 – 1000</div>
            <div className="legend-item"><span style={{ backgroundColor: "#FC4E2A" }}></span> 51 – 150</div>
            <div className="legend-item"><span style={{ backgroundColor: "#FD8D3C" }}></span> 1 – 50</div>
            <div className="legend-item"><span style={{ backgroundColor: "#FFEDA0" }}></span> ≤ 0</div>
          </div>
        </div>

      </div>
    </div>
  );
}
