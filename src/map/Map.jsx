import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import L from "leaflet";
import "./Map.css";

const API_URL = "http://localhost:8000/api/countries";

const { BaseLayer } = LayersControl;

export default function Map({ maxTotal }) {

  const [data, setData] = useState(null);
  const [filtered, setFiltered] = useState(false);

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

  useEffect(() => {

    const delay = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delay);

  }, [maxTotal]);



  // Couleur choroplèthe
  const getColor = (total) => {

    if (total > 2000) return "#800026";
    if (total > 1000) return "#BD0026";
    if (total > 500) return "#E31A1C";
    if (total > 100) return "#FC4E2A";
    if (total > 50) return "#FD8D3C";
    if (total >= 1) return "#FEB24C";
    return "#FFEDA0";
  };


  const geoStyle = (feature) => {

    const total = Number(feature.properties.total || 0);

    if (filtered && !feature.properties.match) {
      return {
        fillColor: "transparent",
        fillOpacity: 0,
        color: "white",
        weight: 1
      };
    }

    return {
      fillColor: getColor(total),
      weight: 1,
      color: "white",
      fillOpacity: 0.7
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

  if (!data) return null;

  return (

    <div style={{ height: "100vh", width: "100%", position:"relative" }}>

      <MapContainer
        center={[-21.452, 47.085]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >

        <LayersControl position="topright">

          {/* FONDS DE CARTE */}

          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Esri Satellite">
            <TileLayer
              attribution="Tiles © Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>

          <BaseLayer name="OpenTopoMap">
            <TileLayer
              attribution="© OpenTopoMap"
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Carto Dark">
            <TileLayer
              attribution="© Carto"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>

        </LayersControl>


        {/* Population */}
        <GeoJSON
          key={JSON.stringify(data)}
          data={data}
          style={geoStyle}
          onEachFeature={onEachFeature}
        />

      </MapContainer>



      {/* LEGENDE */}

      <div className="legend-container">

        <div className="legend">

          <h4>Population Etudiantes</h4>

          <div className="legend-item">
            <span style={{ backgroundColor: "#800026" }}></span> &gt;2000
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#BD0026" }}></span> 1001 – 2000
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#E31A1C" }}></span> 501 – 1000
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#FC4E2A" }}></span> 101 – 500
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#FD8D3C" }}></span> 51 – 100
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#FEB24C" }}></span> 1 – 50
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#FFEDA0" }}></span> 0
          </div>

        </div>

      </div>

    </div>

  );
}