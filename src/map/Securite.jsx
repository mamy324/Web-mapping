// Logement.jsx
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Sidebar from "../components/layout/Sidebar";
import MapControls from '../components/fond/MapControls';
import { BASEMAPS } from '../components/fond/Basemaps';

import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Enregistrement global du plugin datalabels (une seule fois)
Chart.register(ChartDataLabels);



// Correction icônes par défaut Leaflet
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

  // Fetch des données
  useEffect(() => {
    const fetchGeoJson = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = 'http://localhost:8000/api/logement';

        const params = new URLSearchParams();
        if (selectedTypes.length > 0) {
          params.append('types', selectedTypes.join(','));
        }
        if (maxTotal !== null && maxTotal > 0) {
          params.append('max_population', maxTotal);
        }

        if (params.toString()) url += `?${params.toString()}`;

        url += `${url.includes('?') ? '&' : '?'}__cb=${Date.now()}`;

        console.log("[FETCH] URL:", url);

        const response = await fetch(url, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(`Erreur HTTP ${response.status} - ${text.substring(0, 100)}...`);
        }

        const data = await response.json();
        console.log("[FETCH] Données reçues :", data);
        setGeoJsonData(data);
      } catch (err) {
        console.error("[FETCH] Erreur:", err);
        setError(err.message || 'Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJson();
  }, [selectedTypes, maxTotal]);

  // Initialisation de la carte (corrigée pour éviter appendChild undefined)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const container = document.getElementById('map');
    if (!container) {
      console.error("[LEAFLET] Conteneur #map introuvable");
      return;
    }

    try {
      const map = L.map('map', { zoomControl: false })
        .setView([-21.4536, 47.0857], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      // Rafraîchissement obligatoire en React
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
          console.log("[LEAFLET] Carte rafraîchie (invalidateSize)");
        }
      }, 300);

    } catch (err) {
      console.error("[LEAFLET] Erreur init :", err);
    }

    return () => {
      if (mapRef.current) {
        console.log("[LEAFLET] Destruction carte...");
        mapRef.current.remove();
        mapRef.current = null;
      }
      initialized.current = false;
    };
  }, []);

  // Changement fond de carte
  useEffect(() => {
    if (!mapRef.current) return;
    const bm = BASEMAPS[selectedBasemap];
    if (!bm?.url) return;

    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        mapRef.current.removeLayer(layer);
      }
    });

    L.tileLayer(bm.url, {
      attribution: bm.attribution || '',
      maxZoom: bm.maxZoom || 19,
    }).addTo(mapRef.current);
  }, [selectedBasemap]);

  // Polygones + camemberts au centre avec % à l’intérieur
  useEffect(() => {
    if (!mapRef.current) return;

    // Nettoyage
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (pieMarkersGroupRef.current) {
      pieMarkersGroupRef.current.clearLayers();
      mapRef.current.removeLayer(pieMarkersGroupRef.current);
      pieMarkersGroupRef.current = null;
    }

    if (!geoJsonData?.features?.length) {
      console.log("[GEOJSON] Pas de features");
      return;
    }

    console.log("[GEOJSON] Ajout de", geoJsonData.features.length, "polygones");

    // Couche polygones
    geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
      style: (feature) => ({
        fillColor: getColor(feature.properties?.filter_match || 0),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        if (p && p.fokontany) {
          layer.bindPopup(`
            <b>${p.fokontany}</b><br/>
            Location: ${p.location_pct?.toFixed(1) || 0}%<br/>
            Famille: ${p.famille_pct?.toFixed(1) || 0}%<br/>
            Colocation: ${p.coloque_pct?.toFixed(1) || 0}%<br/>
            Cité: ${p.cite_pct?.toFixed(1) || 0}%
          `);
        }
      },
    }).addTo(mapRef.current);

    // Camemberts au centre
    const pieGroup = L.layerGroup().addTo(mapRef.current);
    pieMarkersGroupRef.current = pieGroup;

    geoJsonData.features.forEach(feature => {
      const p = feature.properties;
      if (!p) return;

      const values = [
        p.location_pct || 0,
        p.famille_pct  || 0,
        p.coloque_pct  || 0,
        p.cite_pct     || 0,
      ];

      const total = values.reduce((a, b) => a + b, 0);
      if (total <= 0) return;

      let center;
      try {
        const temp = L.geoJSON(feature);
        center = temp.getBounds().getCenter();
      } catch (e) {
        console.warn("Centroïde impossible pour un polygone");
        return;
      }

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
            borderColor: '#ffffff',
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
              formatter: (value) => value > 5 ? value.toFixed(0) + '%' : '', // affiche si > 5%
              anchor: 'center',
              align: 'center',
            }
          },
          cutout: '0%', // cercle plein
        },
        plugins: [ChartDataLabels],
      });

      const pieIcon = L.divIcon({
        html: canvas,
        className: 'leaflet-pie-chart-icon',
        iconSize: [80, 80],
        iconAnchor: [40, 40],
      });

      const marker = L.marker(center, { icon: pieIcon });

      marker.bindPopup(`
        <b>${p.fokontany || 'Fokontany'}</b><br/>
        Location: ${p.location_pct?.toFixed(1)||0}%<br/>
        Famille: ${p.famille_pct?.toFixed(1)||0}%<br/>
        Colocation: ${p.coloque_pct?.toFixed(1)||0}%<br/>
        Cité: ${p.cite_pct?.toFixed(1)||0}%
      `);

      pieGroup.addLayer(marker);
    });

    // Zoom sur les données
    if (geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [60, 60] });
      }
    }
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

        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontSize: '1.5rem',
          }}>
            Chargement des données...
          </div>
        )}

        {error && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(220,53,69,0.95)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: 1100,
          }}>
            {error}
          </div>
        )}

        {/* Légende fixe à droite (correspondant aux couleurs du camembert) */}
        <div style={{
          position: 'absolute',
          top: '80%',
          right: '20px',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '16px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          minWidth: '180px',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
            Légende
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#FF6384', borderRadius: '4px' }}></div>
              Location
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#36A2EB', borderRadius: '4px' }}></div>
              Famille
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#FFCE56', borderRadius: '4px' }}></div>
              Colocation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#4BC0C0', borderRadius: '4px' }}></div>
              Cité universitaire
            </div>
          </div>
        </div>

        <MapControls
          selectedBasemap={selectedBasemap}
          onBasemapChange={setSelectedBasemap}
        />
      </div>
    </div>
  );
};

export default Logement;