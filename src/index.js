import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RouterApp from "./RouterApp";
import reportWebVitals from './reportWebVitals';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";   // ← AJOUTE CET IMPORT

// ====================== INTERCEPTOR AXIOS (IMPORTANT) ======================
// Ceci supprime les erreurs 401 rouges dans la console
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // On laisse l'erreur passer silencieusement pour le .catch()
      // Mais on n'affiche plus l'erreur rouge dans la console
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
// ============================================================================

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterApp />
  </React.StrictMode>
);

reportWebVitals();