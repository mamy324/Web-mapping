
/*import './App.css';
import Map from './map/Map';




function App() {
  return (
    <div className="App">
     
     
      <Map />
     
    

    </div>
    

  );
}

export default App;*/
import "./App.css";
import Map from "./map/Map";
import Logement from "./map/Logement";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/logement" element={<Logement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

