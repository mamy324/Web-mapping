import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import MapView from "./MapView";



function App() {

  // 🔥 Filtre maxTotal
  const [maxTotal, setMaxTotal] = useState("");

  // 🔥 Types sélectionnés pour camembert
  const [selectedTypes, setSelectedTypes] = useState([]);

  return (
    <div style={{ display: "flex" }}>

      <Sidebar
        maxTotal={maxTotal}
        setMaxTotal={setMaxTotal}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />

      <div style={{ flexGrow: 1 }}>

        <MapView
          
          maxTotal={maxTotal}
          selectedTypes={selectedTypes}
        />

        {/* Si tu veux afficher les 2 composants directement */}
        {/* 
        <Map maxTotal={maxTotal} />
        <Logement
          maxTotal={maxTotal}
          selectedTypes={selectedTypes}
        />
        */}

      </div>
    </div>
  );
}

export default App;