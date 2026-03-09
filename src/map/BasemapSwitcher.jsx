import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function BasemapSwitcher() {

  const map = useMap();

  useEffect(() => {

    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap" }
    );

    const topo = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenTopoMap" }
    );

    const dark = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { attribution: "© CartoDB" }
    );

    const esri = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" }
    );

    const baseMaps = {
      "OpenStreetMap": osm,
      "Topographique": topo,
      "Dark": dark,
      "Satellite (Esri)": esri
    };

    osm.addTo(map);

    const control = L.control.layers(baseMaps).addTo(map);

    return () => {
      map.removeControl(control);
    };

  }, [map]);

  return null;
}