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

      div.style.background="#1e293b";
      div.style.padding="10px";
      div.style.color="white";
      div.style.borderRadius="8px";

      div.innerHTML += "<b>Coût Eau (Ar)</b><br><br>";

      div.innerHTML += '<i style="background:#00441b;width:18px;height:18px;display:inline-block"></i> > 15000<br>';
      div.innerHTML += '<i style="background:#006d2c;width:18px;height:18px;display:inline-block"></i> 10000 - 15000<br>';
      div.innerHTML += '<i style="background:#238b45;width:18px;height:18px;display:inline-block"></i> 7000 - 10000<br>';
      div.innerHTML += '<i style="background:#41ab5d;width:18px;height:18px;display:inline-block"></i> 4000 - 7000<br>';
      div.innerHTML += '<i style="background:#74c476;width:18px;height:18px;display:inline-block"></i> 2000 - 4000<br>';
      div.innerHTML += '<i style="background:#c7e9c0;width:18px;height:18px;display:inline-block"></i> < 2000<br>';
      div.innerHTML += '<i style="background:#d9d9d9;width:18px;height:18px;display:inline-block"></i> Pas de données';

      return div;
    };

    legend.addTo(map);
    legendRef.current = legend;

    return ()=>{

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

export default function CoutEau({ eauRange }) {

  const [data, setData] = useState(null);

  useEffect(() => {

    fetch("http://localhost:8000/api/cout_eau")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));

  }, []);



  // ======================
  // Couleur choroplèthe
  // ======================

  const getColor = (d) => {

    if (!d || d === 0) return "#d9d9d9";

    return d > 15000 ? "#00441b" :
           d > 10000 ? "#006d2c" :
           d > 7000 ? "#238b45" :
           d > 4000 ? "#41ab5d" :
           d > 2000 ? "#74c476" :
                      "#c7e9c0";
  };



  // ======================
  // STYLE
  // ======================

  const style = (feature) => {

    const p = feature.properties || {};
    const eau = Number(p.eau_moyen || 0);

    const min = eauRange ? eauRange[0] : 0;
    const max = eauRange ? eauRange[1] : 20000;

    let color = "#d9d9d9";

    if (eau >= min && eau <= max) {
      color = getColor(eau);
    }

    return {
      fillColor: color,
      weight: 1,
      color: "white",
      fillOpacity: 0.7
    };
  };



  // ======================
  // POPUP
  // ======================

  const onEachFeature = (feature, layer) => {

    const p = feature.properties;

    layer.bindPopup(`
      <b>${p.fokontany}</b><br/>
      Coût eau moyen : ${p.eau_moyen ?? "Pas de données"} Ar
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

        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        <BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>

        <Overlay checked name="Coût Eau">
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