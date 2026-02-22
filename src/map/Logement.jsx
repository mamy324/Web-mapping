// Logement.jsx
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Sidebar from "../components/layout/Sidebar";
import MapControls from '../components/fond/MapControls';
import { BASEMAPS } from '../components/fond/Basemaps';

import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import "./Map.css";

Chart.register(ChartDataLabels);

// Correction icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

const Logement = () => {
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const pieMarkersGroupRef = useRef(null);
  const initialized = useRef(false);

  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBasemap, setSelectedBasemap] = useState('osm');

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxTotal, setMaxTotal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchGeoJson = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = 'http://localhost:8000/api/logement';
        const params = new URLSearchParams();

        if (selectedTypes.length > 0) params.append('types', selectedTypes.join(','));
        if (maxTotal !== null && maxTotal > 0) params.append('max_population', maxTotal);

        if (params.toString()) url += `?${params.toString()}`;
        url += `${url.includes('?') ? '&' : '?'}__cb=${Date.now()}`;

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setGeoJsonData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJson();
  }, [selectedTypes, maxTotal]);

  // ================= INIT MAP =================
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const map = L.map('map').setView([-21.4536, 47.0857], 12);

    L.tileLayer(BASEMAPS.osm.url, {
      attribution: BASEMAPS.osm.attribution,
    }).addTo(map);

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // ================= BASEMAP =================
  useEffect(() => {
    if (!mapRef.current) return;
    const bm = BASEMAPS[selectedBasemap];

    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) mapRef.current.removeLayer(layer);
    });

    L.tileLayer(bm.url, { attribution: bm.attribution }).addTo(mapRef.current);
  }, [selectedBasemap]);

  // ================= GEOJSON + PIE =================
  useEffect(() => {
    if (!mapRef.current) return;

    if (geoJsonLayerRef.current) mapRef.current.removeLayer(geoJsonLayerRef.current);

    if (pieMarkersGroupRef.current) {
      pieMarkersGroupRef.current.clearLayers();
      mapRef.current.removeLayer(pieMarkersGroupRef.current);
    }

    if (!geoJsonData?.features?.length) return;

    // ⭐ POLYGONES
    geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const v = feature.properties?.filter_match || 0;
        return {
          fillColor: v > 0 ? getColor(v) : "#d9d9d9",
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: v > 0 ? 0.7 : 0.25,
        };
      },

      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        layer.bindPopup(`<b>${p.fokontany || "Fokontany"}</b>`);
      },
    }).addTo(mapRef.current);

    // ⭐ CAMEMBERTS
    const pieGroup = L.layerGroup().addTo(mapRef.current);
    pieMarkersGroupRef.current = pieGroup;

    geoJsonData.features.forEach(feature => {
      const p = feature.properties || {};
      const match = p.filter_match || 0;
      if (match <= 0) return;

      let center;
      try {
        const temp = L.geoJSON(feature);
        center = temp.getBounds().getCenter();
      } catch (e) { return; }

      const values = [
        p.location_pct || 0,
        p.famille_pct || 0,
        p.coloque_pct || 0,
        p.cite_pct || 0,
      ];

      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 80;

      new Chart(canvas, {
        type: 'pie',
        data: {
          labels: ['Location', 'Famille', 'Colocation', 'Cité'],
          datasets: [{
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: '#fff',
            borderWidth: 1.5,
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            datalabels: {
              color: '#fff',
              font: { weight: 'bold', size: 10 },
              formatter: (value) => value === 0 ? '' : value.toFixed(0) + '%'
            }
          }
        }
      });

      const pieIcon = L.divIcon({
        html: canvas,
        className: 'leaflet-pie-chart-icon',
        iconSize: [80, 80],
        iconAnchor: [40, 40],
      });

      pieGroup.addLayer(L.marker(center, { icon: pieIcon }));
    });

    const bounds = geoJsonLayerRef.current.getBounds();
    if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [60, 60] });

  }, [geoJsonData]);

  const getColor = (value) => {
    return value > 20 ? '#800026' :
           value > 10 ? '#BD0026' :
           value > 5  ? '#E31A1C' :
           value > 2  ? '#FC4E2A' :
           value > 0  ? '#FD8D3C' :
                        '#FFEDA0';
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        maxTotal={maxTotal}
        setMaxTotal={setMaxTotal}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <div id="map" style={{ height: '100%', width: '100%' }} />

        {loading && <div className="loading-overlay">Chargement...</div>}
        {error && <div className="error-overlay">Erreur : {error}</div>}

        <MapControls
          selectedBasemap={selectedBasemap}
          onBasemapChange={setSelectedBasemap}
        />
      </div>
    </div>
  );
};

export default Logement;
