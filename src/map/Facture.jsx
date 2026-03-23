import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";

import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";

import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const API_URL="http://localhost:8000/api/facture";

const {BaseLayer}=LayersControl;


/* ---------- CONTROLES ---------- */

function MapControls(){

const map=useMap();
const controlsAdded=useRef(false);

useEffect(()=>{

if(controlsAdded.current) return;

L.control.fullscreen({position:"topleft"}).addTo(map);

L.control.scale({
metric:true,
imperial:false,
position:"bottomleft"
}).addTo(map);

controlsAdded.current=true;

},[map]);

return null;

}


/* ---------- COUCHE ---------- */

function CoutElectriciteLayer({selectedTypes}){

const map=useMap();

const [data,setData]=useState(null);

const pieLayerRef=useRef(null);
const chartsRef=useRef({});


/* ---------- CHARGEMENT DATA ---------- */

useEffect(()=>{

fetch(API_URL)
.then(res=>res.json())
.then(json=>setData(json));

},[]);


/* ---------- CHOROPLETHE ---------- */

const getColor=(d)=>{

return d>10?"#800026":
d>5?"#BD0026":
d>3?"#E31A1C":
d>2?"#FC4E2A":
d>=1?"#FD8D3C":
"#FFEDA0";

};

const style=(feature)=>{

const total=Number(feature.properties?.total1||0);

return{
fillColor:getColor(total),
weight:1,
color:"white",
fillOpacity:0.7
};

};


/* ---------- PIE CHARTS ---------- */

useEffect(()=>{

if(!map || !data) return;

/* supprimer anciens camemberts */

if(pieLayerRef.current){
map.removeLayer(pieLayerRef.current);
}

Object.values(chartsRef.current).forEach(chart=>{
chart.destroy();
});

chartsRef.current={};

const group=L.layerGroup().addTo(map);


/* créer nouveaux camemberts */

data.features.forEach(feature=>{

const p=feature.properties;

const values={
gratuit:Number(p.gratuit_pct||0),
abordable:Number(p.abordable_pct||0),
assezcher:Number(p.assezcher_pct||0),
trescher:Number(p.trescher_pct||0)
};

const labels=[];
const dataset=[];
const colors=[];

if(selectedTypes.includes("gratuit")){
labels.push("Gratuit");
dataset.push(values.gratuit);
colors.push("#22c55e");
}

if(selectedTypes.includes("abordable")){
labels.push("Abordable");
dataset.push(values.abordable);
colors.push("#3b82f6");
}

if(selectedTypes.includes("assez cher")){
labels.push("Assez cher");
dataset.push(values.assezcher);
colors.push("#facc15");
}

if(selectedTypes.includes("tres cher")){
labels.push("Très cher");
dataset.push(values.trescher);
colors.push("#ef4444");
}

const total=dataset.reduce((a,b)=>a+b,0);

if(total===0) return;

const center=L.geoJSON(feature).getBounds().getCenter();

const canvasId=`chart-${p.gid}`;

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


setTimeout(()=>{

const ctx=document.getElementById(canvasId);

if(!ctx) return;

const chart=new Chart(ctx,{
type:"pie",
data:{
labels:labels,
datasets:[{
data:dataset,
backgroundColor:colors
}]
},
options:{
responsive:false,
plugins:{
legend:{display:false},
datalabels:{
color:"#ffffff",
font:{
weight:"bold",
size:11
},
formatter:(value)=>{
return value>0 ? value.toFixed(0)+"%" : "";
},
anchor:"center",
align:"center"
}
}
}
});

chartsRef.current[canvasId]=chart;

},50);

marker.bindPopup(`
<b>Fokontany :</b> ${p.fokontany}<br/>
<b>Total logements :</b> ${p.total1}
`);

});

pieLayerRef.current=group;

},[data,selectedTypes,map]);


if(!data) return null;

return <GeoJSON data={data} style={style}/>;

}


/* ---------- CARTE ---------- */

export default function CoutElectricite({selectedTypes}){

return(

<div style={{height:"100vh",width:"100%",position:"relative"}}>

<MapContainer
center={[-21.452,47.085]}
zoom={13}
style={{height:"100%",width:"100%"}}
>

<LayersControl position="topright">

<BaseLayer checked name="OpenStreetMap">
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
</BaseLayer>

</LayersControl>

<MapControls/>

<CoutElectriciteLayer selectedTypes={selectedTypes}/>

</MapContainer>


{/* ---------- LEGENDE ---------- */}

<div
style={{
position:"absolute",
bottom:"20px",
right:"20px",
background:"white",
padding:"10px",
borderRadius:"6px",
boxShadow:"0 0 6px rgba(0,0,0,0.3)",
fontSize:"13px",
zIndex:1000
}}
>

<b>Coût électricité</b>

<div>
<span style={{background:"#22c55e",width:"14px",height:"14px",display:"inline-block"}}></span>
 Gratuit
</div>

<div>
<span style={{background:"#3b82f6",width:"14px",height:"14px",display:"inline-block"}}></span>
 Abordable
</div>

<div>
<span style={{background:"#facc15",width:"14px",height:"14px",display:"inline-block"}}></span>
 Assez cher
</div>

<div>
<span style={{background:"#ef4444",width:"14px",height:"14px",display:"inline-block"}}></span>
 Très cher
</div>

</div>

</div>

);

}