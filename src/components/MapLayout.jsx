import React from "react";

function MapLayout({ children }) {

  return (

    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative"
      }}
    >

      {children}

    </div>

  );

}

export default MapLayout;