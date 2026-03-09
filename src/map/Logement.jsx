
import { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";




Chart.register(ChartDataLabels);

export default function Logement({ selectedTypes }) {

  const map = useMap();

  const [data, setData] = useState(null);
  const [pieLayer, setPieLayer] = useState(null);
  const [legend, setLegend] = useState(null);

  // =========================
  // Charger données backend
  // =========================
  useEffect(() => {

    if (!selectedTypes || selectedTypes.length === 0) {
      setData(null);
      return;
    }

    const typesMap = {
      location: "location1",
      famille: "famille1",
      colocation: "coloque",
      cite: "cite"
    };

    const typesQuery = selectedTypes
      .map(t => typesMap[t])
      .filter(Boolean)
      .join(",");

    fetch(`http://localhost:8000/api/logement?types=${typesQuery}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));

  }, [selectedTypes]);



  // =========================
  // Choroplèthe
  // =========================

  const getColor = (d) => {
    if (d >= 20) return "#800026";
    if (d >= 10) return "#BD0026";
    if (d >= 5) return "#E31A1C";
    if (d >= 2) return "#FC4E2A";
    if (d >= 1) return "#FD8D3C";
    return "#FFEDA0";
  };

  const style = (feature) => {

    const p = feature.properties || {};

    const total =
      (p.location_pct || 0) +
      (p.famille_pct || 0) +
      (p.coloque_pct || 0) +
      (p.cite_pct || 0);

    return {
      fillColor: getColor(total),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7
    };
  };

  useEffect(() => {

    if (!map) return;

    if (pieLayer) {
      map.removeLayer(pieLayer);
    }

    if (!data || !selectedTypes || selectedTypes.length === 0) return;

    const group = L.layerGroup().addTo(map);

    data.features.forEach(feature => {

      const p = feature.properties;
      if (!p) return;

      const values = {
        location: Number(p.location_pct || 0),
        famille: Number(p.famille_pct || 0),
        colocation: Number(p.coloque_pct || 0),
        cite: Number(p.cite_pct || 0)
      };

      const dataset = [
        selectedTypes.includes("location") ? values.location : 0,
        selectedTypes.includes("famille") ? values.famille : 0,
        selectedTypes.includes("colocation") ? values.colocation : 0,
        selectedTypes.includes("cite") ? values.cite : 0
      ];

      const total = dataset.reduce((a, b) => a + b, 0);

      if (total === 0) return;

      const center = L.geoJSON(feature).getBounds().getCenter();

      const canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 80;

      new Chart(canvas, {
        type: "pie",
        data: {
          labels: ["Location", "Famille", "Colocation", "Cité"],
          datasets: [{
            data: dataset,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0"
            ]
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              color: "#fff",
              font: { weight: "bold", size: 10 },
              formatter: (value) => value > 0 ? value.toFixed(0) + "%" : ""
            }
          }
        },
        plugins: [ChartDataLabels]
      });

      const marker = L.marker(center, {
        icon: L.divIcon({
          html: canvas,
          className: "",
          iconSize: [80, 80],
          iconAnchor: [40, 40]
        })
      });

      marker.bindPopup(`<b>${p.fokontany || "Fokontany inconnu"}</b>`);

      group.addLayer(marker);

    });

    setPieLayer(group);

  }, [data, map, selectedTypes]);


 
  // =========================
  // RETURN
  // =========================

  if (!data) return null;

  return (
    <GeoJSON
      key={JSON.stringify(selectedTypes)}
      data={data}
      style={style}
      
    />
    
  );
}

