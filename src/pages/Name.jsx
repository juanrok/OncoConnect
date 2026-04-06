import { useState } from "react";
import TopBar from "../components/TopBar";

export default function Name({ onBack, onNext, onSetName }) {
  const [name, setName] = useState("");

  return (
    <>
      <TopBar />
      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
            ¡Hola! Por favor, cuéntanos tu nombre:
          </h1>
          <button className="linkBtn" onClick={onBack}>Volver</button>
        </div>

        <div className="field" style={{ marginTop: 18 }}>
          <input
            className="lineInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Alejandra Salas"
          />
        </div>

        <button
          className="primaryBtn"
          style={{ marginTop: 22 }}
          onClick={() => {
            onSetName(name || "Nombre");
            onNext();
          }}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}