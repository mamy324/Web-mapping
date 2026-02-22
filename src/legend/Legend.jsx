import "./Legend.css";

export default function Legend() {
  return (
    <div className="legend">
      <h4>Légende (habitants)</h4>
      <div className="legend-item"><span style={{ background: "#800026" }}></span> &gt; 2000</div>
      <div className="legend-item"><span style={{ background: "#BD0026" }}></span> 1001 – 2000</div>
      <div className="legend-item"><span style={{ background: "#E31A1C" }}></span> 501 – 1000</div>
      <div className="legend-item"><span style={{ background: "#FC4E2A" }}></span> 201 – 500</div>
      <div className="legend-item"><span style={{ background: "#FD8D3C" }}></span> 51 – 200</div>
      <div className="legend-item"><span style={{ background: "#FFEDA0" }}></span> ≤ 50</div>
    </div>
  );
}
