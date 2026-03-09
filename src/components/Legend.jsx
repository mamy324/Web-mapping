import React from "react";

function Legend({ type }) {

  if (type === "population") {

    return (

      <div className="legend-container">
        <div className="legend">

          <h4>Population Etudiantes</h4>

          <div className="legend-item">
            <span style={{ backgroundColor: "#800026" }}></span> &gt;2000
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#BD0026" }}></span> 1001 – 2000
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#E31A1C" }}></span> 151 – 1000
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#FC4E2A" }}></span> 51 – 150
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#FD8D3C" }}></span> 1 – 50
          </div>

          <div className="legend-item">
            <span style={{ backgroundColor: "#FFEDA0" }}></span> ≤ 0
          </div>

        </div>
      </div>

    );
  }

  if (type === "logement") {

    return (

      <div className="legend-container">
        <div className="legend">

          <h4>Types de logement</h4>

          <div>
            <span style={{background:"#FF6384",width:"12px",height:"12px",display:"inline-block",marginRight:"5px"}}></span>
            Location
          </div>

          <div>
            <span style={{background:"#36A2EB",width:"12px",height:"12px",display:"inline-block",marginRight:"5px"}}></span>
            Famille
          </div>

          <div>
            <span style={{background:"#FFCE56",width:"12px",height:"12px",display:"inline-block",marginRight:"5px"}}></span>
            Colocation
          </div>

          <div>
            <span style={{background:"#4BC0C0",width:"12px",height:"12px",display:"inline-block",marginRight:"5px"}}></span>
            Cité
          </div>

        </div>
      </div>

    );
  }

  return null;

}

export default Legend;