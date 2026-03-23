import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";

import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const API_URL = "http://localhost:8000/api/securite";
const { BaseLayer } = LayersControl;


/* ================= CONTROLES ================= */

function MapControls() {

  const map = useMap();
  const controlsAdded = useRef(false);

  useEffect(() => {

    if (controlsAdded.current) return;

    L.control.fullscreen({
      position: "topleft"
    }).addTo(map);

    L.control.scale({
      metric: true,
      imperial: false,
      position: "bottomleft"
    }).addTo(map);

    controlsAdded.current = true;

  }, [map]);

  return null;
}


/* ================= LEGENDE ================= */

function Legend() {

  const map = useMap();
  const legendAdded = useRef(false);

  useEffect(() => {

    if (legendAdded.current) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {

      const div = L.DomUtil.create("div");

      div.style.background = "#1e293b";
      div.style.padding = "10px";
      div.style.borderRadius = "8px";
      div.style.color = "white";

      div.innerHTML = `
      <b>Sécurité</b><br><br>

      <div>
      <span style="background:#16a34a;width:12px;height:12px;display:inline-block;margin-right:6px;"></span>
      Sécurisé
      </div>

      <div>
      <span style="background:#facc15;width:12px;height:12px;display:inline-block;margin-right:6px;"></span>
      Sécurité moyenne
      </div>

      <div>
      <span style="background:#dc2626;width:12px;height:12px;display:inline-block;margin-right:6px;"></span>
      Peu sécurisé
      </div>
      `;

      return div;
    };

    legend.addTo(map);
    legendAdded.current = true;

  }, [map]);

  return null;
}


/* ================= COUCHE SECURITE ================= */

function SecuriteLayer({ selectedTypes }) {

  const map = useMap();
  const [data, setData] = useState(null);

  const pieLayerRef = useRef(null);
  const chartsRef = useRef({});


  /* ===== charger données ===== */

  useEffect(() => {

    fetch(API_URL)
      .then(res => res.json())
      .then(json => {

        console.log("DATA API securite :", json);

        setData(json);

      });

  }, []);


  /* ===== choroplèthe ===== */

  function getColor(d) {

    return d > 10 ? "#800026" :
           d > 5 ? "#BD0026" :
           d > 3 ? "#E31A1C" :
           d > 2 ? "#FC4E2A" :
           d >= 1 ? "#FD8D3C" :
                    "#FFEDA0";
  }

  function style(feature) {

    const total = Number(feature.properties?.total1 || 0);

    return {
      fillColor: getColor(total),
      weight: 1,
      color: "white",
      fillOpacity: 0.7
    };
  }


  function onEachFeature(feature, layer) {

    const p = feature.properties || {};

    const popupContent = `
      <b>Fokontany :</b> ${p.fokontany || "N/A"}<br/>
      <b>Total logements :</b> ${p.total1 || 0}<br/><br/>

      <b>Sécurité :</b><br/>
      Sécurisé : ${(Number(p.securite_pct)||0).toFixed(2)} %<br/>
      Sécurité moyenne : ${(Number(p.moyennesec_pct)||0).toFixed(2)} %<br/>
      Peu sécurisé : ${(Number(p.peusecu_pct)||0).toFixed(2)} %
    `;

    layer.bindPopup(popupContent);

  }


  /* ================= CAMEMBERTS ================= */

  useEffect(() => {

    if (!map || !data) return;

    if (pieLayerRef.current) {

      pieLayerRef.current.clearLayers();
      map.removeLayer(pieLayerRef.current);

    }

    const group = L.layerGroup().addTo(map);


    data.features.forEach(feature => {

      if (!feature.geometry) return;

      const bounds = L.geoJSON(feature).getBounds();
      if (!bounds.isValid()) return;

      const center = bounds.getCenter();
      const p = feature.properties || {};

      const dataset = [

        selectedTypes.includes("securisé") ? Number(p.securite_pct || 0) : 0,
        selectedTypes.includes("securité moyenne") ? Number(p.moyennesec_pct || 0) : 0,
        selectedTypes.includes("peu securisé") ? Number(p.peusecu_pct || 0) : 0

      ];

      const canvasId = `chart-sec-${p.gid}`;

      const div = document.createElement("div");
      div.innerHTML = `<canvas id="${canvasId}" width="50" height="50"></canvas>`;


      const marker = L.marker(center, {

        icon: L.divIcon({
          html: div,
          className: "",
          iconSize: [70, 70],
          iconAnchor: [35, 35]
        })

      }).addTo(group);


      /* popup sur camembert */

      const popupContent = `
        <b>Fokontany :</b> ${p.fokontany || "N/A"}<br/>
        <b>Total logements :</b> ${p.total1 || 0}<br/><br/>

        <b>Sécurité :</b><br/>
        Sécurisé : ${(Number(p.securite_pct)||0).toFixed(2)} %<br/>
        Sécurité moyenne : ${(Number(p.moyennesec_pct)||0).toFixed(2)} %<br/>
        Peu sécurisé : ${(Number(p.peusecu_pct)||0).toFixed(2)} %
      `;

      marker.bindPopup(popupContent);


      setTimeout(() => {

        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        if (chartsRef.current[canvasId]) {
          chartsRef.current[canvasId].destroy();
        }

        chartsRef.current[canvasId] = new Chart(canvas, {

          type: "pie",

          data: {
            labels: ["Sécurisé", "Sécurité moyenne", "Peu sécurisé"],
            datasets: [{
              data: dataset,
              backgroundColor: ["#16a34a", "#facc15", "#dc2626"]
            }]
          },

          options: {
            responsive: false,
            plugins: {
              legend: { display: false },
              datalabels: {
                color: "#fff",
                font: { size: 10 },
                formatter: (v) => v > 0 ? Math.round(v) + "%" : ""
              }
            }
          }

        });

      }, 100);

    });

    pieLayerRef.current = group;

  }, [data, map, selectedTypes]);


  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      style={style}
      onEachFeature={onEachFeature}
    />
  );

}


/* ================= CARTE ================= */

export default function Securite({ selectedTypes }) {

  return (

    <div style={{ height: "100vh", width: "100%" }}>

      <MapContainer
        center={[-21.452, 47.085]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >

        <LayersControl position="topright">

          <BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </BaseLayer>

          <BaseLayer name="Topographic">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </BaseLayer>

          <BaseLayer name="Carto Light">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          </BaseLayer>

        </LayersControl>

        <MapControls />

        <SecuriteLayer selectedTypes={selectedTypes} />

        <Legend />

      </MapContainer>

    </div>

  );

}