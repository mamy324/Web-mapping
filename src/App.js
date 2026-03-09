import React, { useState } from "react";
import Sidebar from "./Sidebar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CartePopulation from "./pages/CartePopulation";
import CarteLogement from "./pages/CarteLogement";

function App() {

  const [maxTotal, setMaxTotal] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  return (
    <Router>

      <div style={{ display: "flex" }}>

        <Sidebar
          maxTotal={maxTotal}
          setMaxTotal={setMaxTotal}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />

        <div style={{ flexGrow: 1 }}>

          <Routes>

            <Route
              path="/population"
              element={<CartePopulation maxTotal={maxTotal} />}
            />

            <Route
              path="/logement"
              element={<CarteLogement selectedTypes={selectedTypes} />}
            />

          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;