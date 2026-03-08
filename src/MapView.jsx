import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

import Map from "./map/Map";           // couche population
import Logement from "./map/Logement"; // couche logement

const { BaseLayer, Overlay } = LayersControl;


// 🔧 correction taille carte
function MapInvalidateSize() {

  const map = useMap();

  useEffect(() => {

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(timer);

  }, [map]);

  return null;
}


function MapView({ maxTotal, selectedTypes }) {

  return (

    <MapContainer
      center={[-21.45, 47.09]} // Fianarantsoa
      zoom={12.5}
      style={{ height: "100vh", width: "100%" }}
    >

      <MapInvalidateSize />

      {/* 🎛️ CONTROLE DES COUCHES */}
      <LayersControl position="topright">

        {/* 🗺️ FONDS DE CARTE */}

        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        <BaseLayer name="Esri Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>

        <BaseLayer name="OpenTopoMap">
          <TileLayer
            attribution="&copy; OpenTopoMap contributors"
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        <BaseLayer name="Carto Dark">
          <TileLayer
            attribution="&copy; Carto"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </BaseLayer>


        {/* 🔥 COUCHES DE DONNÉES */}

        {/* Population étudiante */}
        <Overlay checked name="Population étudiante">
          <Map maxTotal={maxTotal} />
        </Overlay>

        {/* Logement étudiant */}
        <Overlay checked name="Logement étudiant">
          <Logement selectedTypes={selectedTypes} />
        </Overlay>

      </LayersControl>

    </MapContainer>

  );
}

export default MapView;