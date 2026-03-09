import React from "react";

function BasemapSelector({ changeBasemap }) {

  return (

    <div style={{ position:"absolute", top:10, right:10, zIndex:1000 }}>

      <select onChange={(e)=>changeBasemap(e.target.value)}>

        <option value="osm">OpenStreetMap</option>
        <option value="satellite">Satellite</option>
        <option value="topo">Topo</option>
        <option value="dark">Dark</option>

      </select>

    </div>

  );

}

export default BasemapSelector;