import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";

import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const API_URL = "http://localhost:8000/api/electricite";
const { BaseLayer } = LayersControl;


/* ================= CONTROLES ================= */

function MapControls(){

  const map = useMap();
  const added = useRef(false);

  useEffect(()=>{

    if(added.current) return;

    L.control.fullscreen({position:"topleft"}).addTo(map);

    L.control.scale({
      metric:true,
      imperial:false,
      position:"bottomleft"
    }).addTo(map);

    added.current = true;

  },[map]);

  return null;
}


/* ================= LEGENDE ================= */

function Legend(){

  const map = useMap();
  const legendRef = useRef(null);

  useEffect(()=>{

    if(legendRef.current) return;

    const legend = L.control({position:"bottomright"});

    legend.onAdd = ()=>{

      const div = L.DomUtil.create("div");

      div.style.background="#1e293b";
      div.style.padding="10px";
      div.style.color="white";
      div.style.borderRadius="8px";

      div.innerHTML = `
      <b>Source Electricité</b><br><br>

      <div>
      <span style="background:#facc15;width:12px;height:12px;display:inline-block;margin-right:6px;"></span>
      JIRAMA
      </div>

      <div>
      <span style="background:#ef4444;width:12px;height:12px;display:inline-block;margin-right:6px;"></span>
      Groupe
      </div>

      <div>
      <span style="background:#22c55e;width:12px;height:12px;display:inline-block;margin-right:6px;"></span>
      Aucun
      </div>
      `;

      return div;
    };

    legend.addTo(map);
    legendRef.current = legend;

  },[map]);

  return null;
}


/* COUCHE  */

function ElectriciteLayer({selectedTypes}){

  const map = useMap();

  const [data,setData] = useState(null);

  const pieLayerRef = useRef(null);
  const chartsRef = useRef({});


  useEffect(()=>{

    const types = selectedTypes?.join(",") || "";

    fetch(`${API_URL}?types=${types}`)
      .then(res=>res.json())
      .then(json=>{

        console.log("DATA ELECTRICITE:",json);
        setData(json);

      });

  },[selectedTypes]);


  function getColor(d){

    return d>10?"#800026":
           d>5?"#BD0026":
           d>3?"#E31A1C":
           d>2?"#FC4E2A":
           d>=1?"#FD8D3C":
          "#FFEDA0";

  }


  function style(feature){

    const total = Number(feature.properties?.selected_total || 0);

    return{
      fillColor:getColor(total),
      weight:1,
      color:"white",
      fillOpacity:0.7
    };

  }


  function onEachFeature(feature,layer){

    const p = feature.properties || {};

    const popup = `
    <b>Fokontany :</b> ${p.fokontany || "N/A"}<br/>
    <b>Total étudiants :</b> ${p.total1 || 0}<br/><br/>

    <b>Electricité :</b><br/>
    JIRAMA : ${(Number(p.jirama_pct)||0).toFixed(2)} %<br/>
    Groupe : ${(Number(p.groupe_pct)||0).toFixed(2)} %<br/>
    Autre : ${(Number(p.autre_pct)||0).toFixed(2)} %
    `;

    layer.bindPopup(popup);

  }


/* ================= CAMEMBERT ================= */

useEffect(()=>{

  if(!map || !data) return;

  if(pieLayerRef.current){

    pieLayerRef.current.clearLayers();
    map.removeLayer(pieLayerRef.current);

  }

  const group = L.layerGroup().addTo(map);


  data.features.forEach(feature=>{

    const bounds = L.geoJSON(feature).getBounds();
    if(!bounds.isValid()) return;

    const center = bounds.getCenter();
    const p = feature.properties || {};


    const dataset=[

      selectedTypes.includes("jiramae") ? Number(p.jirama_pct||0) : 0,
      selectedTypes.includes("groupe1") ? Number(p.groupe_pct||0) : 0,
      selectedTypes.includes("autre1") ? Number(p.autre_pct||0) : 0

    ];


    const canvasId=`chart-elec-${p.gid}`;

    const div=document.createElement("div");
    div.innerHTML=`<canvas id="${canvasId}" width="50" height="50"></canvas>`;


    const marker=L.marker(center,{
      icon:L.divIcon({
        html:div,
        className:"",
        iconSize:[70,70],
        iconAnchor:[35,35]
      })
    }).addTo(group);


    marker.bindPopup(`
    <b>${p.fokontany}</b><br/>
    Total étudiants : ${p.total1}
    `);


    setTimeout(()=>{

      const canvas=document.getElementById(canvasId);
      if(!canvas) return;

      if(chartsRef.current[canvasId]){
        chartsRef.current[canvasId].destroy();
      }

      chartsRef.current[canvasId]=new Chart(canvas,{

        type:"pie",

        data:{
          labels:["JIRAMA","Groupe","Autre"],
          datasets:[{
            data:dataset,
            backgroundColor:["#facc15","#ef4444","#22c55e"]
          }]
        },

        options:{
          responsive:false,
          plugins:{
            legend:{display:false},
            datalabels:{
              color:"#fff",
              font:{size:10},
              formatter:(v)=>v>0 ? Math.round(v)+"%" : ""
            }
          }
        }

      });

    },100);

  });


  pieLayerRef.current=group;

},[data,map,selectedTypes]);


if(!data) return null;

return(

  <GeoJSON
    data={data}
    style={style}
    onEachFeature={onEachFeature}
  />

);

}


/* ================= CARTE ================= */

export default function Electricite({selectedTypes}){

  return(

    <div style={{height:"100vh",width:"100%"}}>

      <MapContainer
        center={[-21.452,47.085]}
        zoom={13}
        style={{height:"100%",width:"100%"}}
      >

        <LayersControl position="topright">

          <BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
          </BaseLayer>

          <BaseLayer name="Topographic">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"/>
          </BaseLayer>

          <BaseLayer name="Carto Light">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"/>
          </BaseLayer>

        </LayersControl>

        <MapControls/>

        <ElectriciteLayer selectedTypes={selectedTypes}/>

        <Legend/>

      </MapContainer>

    </div>

  );

}