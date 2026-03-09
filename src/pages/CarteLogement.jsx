import { MapContainer, TileLayer } from "react-leaflet";
import Logement from "../map/Logement";
import MapLayout from "../components/MapLayout";
import Legend from "../components/Legend";
import BasemapSwitcher from "../map/BasemapSwitcher";

export default function CarteLogement({ selectedTypes }) {

  return (

    <MapLayout>

      <MapContainer
        center={[-21.452, 47.085]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Logement selectedTypes={selectedTypes} />

        <BasemapSwitcher />

      </MapContainer>

      <Legend type="logement" />

    </MapLayout>

  );
}