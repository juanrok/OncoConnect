import { useState } from "react";
import TopBar from "../components/TopBar";
import Select from "../components/Select";

export default function AddMedication({ onBack }) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");

  const meds = [
    "Lapatinib",
    "Neratinib",
    "Tucatinib",
    "Palbociclib",
    "Ribociclib",
    "Abemaciclib",
    "Everolimus",
    "Alpelisib",
    "Tamoxifeno",
    "Letrozol",
    "Anastrozol",
  ];

  const doses = ["20mg", "40mg", "80mg", "120mg", "240mg"];

  return (
    <>
      <TopBar />
      <div className="content">
        <div className="rowBetween" style={{ marginTop: 10 }}>
          <div className="formTitle">Añadir un medicamento</div>
          <button
            type="button"
            onClick={onBack}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 800,
              color: "rgba(43,15,16,0.8)"
            }}
          >
            Volver
          </button>
        </div>

        <div className="field">
          <div className="label">Nombre</div>
          <Select
            placeholder="Selecciona una opción..."
            options={meds}
            value={name}
            onChange={setName}
          />
        </div>

        <div className="field">
          <div className="label">Dosis</div>
          <Select
            placeholder="Selecciona una opción..."
            options={doses}
            value={dose}
            onChange={setDose}
          />
        </div>

        <button
          style={{
            marginTop: 18,
            background: "#e1006a",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: 999,
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          Guardar
        </button>
      </div>
    </>
  );
}