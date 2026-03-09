import { MapContainer, TileLayer } from "react-leaflet";
import Map from "../map/Map";
import MapLayout from "../components/MapLayout";
import Legend from "../components/Legend";
import BasemapSwitcher from "../map/BasemapSwitcher";

export default function CartePopulation({ maxTotal }) {

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

        <Map maxTotal={maxTotal} />

        <BasemapSwitcher />

      </MapContainer>

      <Legend type="population" />

    </MapLayout>

  );
}