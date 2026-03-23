/*import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";


// ======================
// Légende composant
// ======================

function Legend() {

  const map = useMap();

  useEffect(() => {

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {

      const div = L.DomUtil.create("div", "info legend");

      div.innerHTML += "<h4>Coût logement</h4>";

      div.innerHTML += '<i style="background:#08306b;width:18px;height:18px;display:inline-block"></i> > 80000<br>';
      div.innerHTML += '<i style="background:#08519c;width:18px;height:18px;display:inline-block"></i> 60000 - 80000<br>';
      div.innerHTML += '<i style="background:#2171b5;width:18px;height:18px;display:inline-block"></i> 40000 - 60000<br>';
      div.innerHTML += '<i style="background:#4292c6;width:18px;height:18px;display:inline-block"></i> 20000 - 40000<br>';
      div.innerHTML += '<i style="background:#6baed6;width:18px;height:18px;display:inline-block"></i> 10000 - 20000<br>';
      div.innerHTML += '<i style="background:#c6dbef;width:18px;height:18px;display:inline-block"></i> < 10000';

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };

  }, [map]);

  return null;
}


export default function Loyer({ prixRange }) {

  const [data, setData] = useState(null);

  // ======================
  // Charger données API
  // ======================

  useEffect(() => {

    const minPrix = prixRange ? prixRange[0] : 0;
    const maxPrix = prixRange ? prixRange[1] : 100000;

    fetch(`http://localhost:8000/api/loyer?minPrix=${minPrix}&maxPrix=${maxPrix}`)
      .then(res => res.json())
      .then(data => {
        console.log("API DATA :", data);
        setData(data);
      })
      .catch(err => console.error(err));

  }, [prixRange]);


  // ======================
  // Couleur choroplèthe
  // ======================

  const getColor = (d) => {
    return d > 80000 ? "#08306b" :
           d > 60000 ? "#08519c" :
           d > 40000 ? "#2171b5" :
           d > 20000 ? "#4292c6" :
           d > 10000 ? "#6baed6" :
                       "#c6dbef";
  };


  const style = (feature) => {

    const p = feature.properties || {};
    const loyer = Number(p.loge_moyen || 0);

    return {
      fillColor: getColor(loyer),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7
    };
  };


  // ======================
  // Popup
  // ======================

  const onEachFeature = (feature, layer) => {

    const p = feature.properties;

    layer.bindPopup(`
      <b>${p.fokontany}</b><br/>
      Loyer moyen : ${p.loge_moyen} Ar
    `);

  };


  if (!data) return null;


  return (

    <MapContainer
      center={[-21.452, 47.085]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <GeoJSON
        data={data}
        style={style}
        onEachFeature={onEachFeature}
      />

      <Legend />

    </MapContainer>

  );
}*/

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";

const { BaseLayer, Overlay } = LayersControl;



// ======================
// CONTROLES CARTE
// ======================

function MapControls(){

  const map = useMap();
  const added = useRef(false);

  useEffect(()=>{

    if(added.current) return;

    const fullscreen = L.control.fullscreen({
      position:"topleft"
    }).addTo(map);

    const scale = L.control.scale({
      metric:true,
      imperial:false,
      position:"bottomleft"
    }).addTo(map);

    added.current = true;

    return ()=>{

      map.removeControl(fullscreen);
      map.removeControl(scale);
      added.current=false;

    };

  },[map]);

  return null;

}



// ======================
// LEGENDE
// ======================

function Legend() {

  const map = useMap();
  const legendRef = useRef(null);

  useEffect(() => {

    if(legendRef.current) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {

      const div = L.DomUtil.create("div", "info legend");

      div.style.background = "#1e293b";
      div.style.padding = "10px";
      div.style.color = "white";
      div.style.borderRadius = "8px";

      div.innerHTML += "<b>Coût logement</b><br><br>";

      div.innerHTML += '<i style="background:#08306b;width:18px;height:18px;display:inline-block"></i> > 80000<br>';
      div.innerHTML += '<i style="background:#08519c;width:18px;height:18px;display:inline-block"></i> 60000 - 80000<br>';
      div.innerHTML += '<i style="background:#2171b5;width:18px;height:18px;display:inline-block"></i> 40000 - 60000<br>';
      div.innerHTML += '<i style="background:#4292c6;width:18px;height:18px;display:inline-block"></i> 20000 - 40000<br>';
      div.innerHTML += '<i style="background:#6baed6;width:18px;height:18px;display:inline-block"></i> 10000 - 20000<br>';
      div.innerHTML += '<i style="background:#c6dbef;width:18px;height:18px;display:inline-block"></i> < 10000<br>';
      div.innerHTML += '<i style="background:#d9d9d9;width:18px;height:18px;display:inline-block"></i> Pas de données';

      return div;
    };

    legend.addTo(map);
    legendRef.current = legend;

    return () => {

      if(legendRef.current){
        map.removeControl(legendRef.current);
        legendRef.current=null;
      }

    };

  }, [map]);

  return null;
}



// ======================
// COMPOSANT PRINCIPAL
// ======================

export default function Loyer({ prixRange }) {

  const [data, setData] = useState(null);

  useEffect(() => {

    fetch("http://localhost:8000/api/loyer")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));

  }, []);



  // ======================
  // Couleur choroplèthe
  // ======================

  const getColor = (d) => {

    if (!d || d === 0) return "#d9d9d9";

    return d > 80000 ? "#08306b" :
           d > 60000 ? "#08519c" :
           d > 40000 ? "#2171b5" :
           d > 20000 ? "#4292c6" :
           d > 10000 ? "#6baed6" :
                       "#c6dbef";
  };



  // ======================
  // Style
  // ======================

  const style = (feature) => {

    const p = feature.properties || {};
    const loyer = Number(p.loge_moyen || 0);

    const minPrix = prixRange ? prixRange[0] : 0;
    const maxPrix = prixRange ? prixRange[1] : 100000;

    let color = "#d9d9d9";

    if (loyer >= minPrix && loyer <= maxPrix) {
      color = getColor(loyer);
    }

    return {
      fillColor: color,
      weight: 1,
      color: "white",
      fillOpacity: 0.7
    };
  };



  // ======================
  // Popup
  // ======================

  const onEachFeature = (feature, layer) => {

    const p = feature.properties;

    layer.bindPopup(`
      <b>${p.fokontany}</b><br/>
      Loyer moyen : ${p.loge_moyen ?? "Pas de données"} Ar
    `);

  };



  if (!data) return null;



  return (

    <MapContainer
      center={[-21.452, 47.085]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
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



        {/* COUCHE DONNÉES */}

        <Overlay checked name="Coût logement">
          <GeoJSON
            data={data}
            style={style}
            onEachFeature={onEachFeature}
          />
        </Overlay>

      </LayersControl>

      <MapControls />

      <Legend />

    </MapContainer>

  );

}