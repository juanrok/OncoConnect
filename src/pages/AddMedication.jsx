import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Select from "../components/Select";

export default function AddMedication() {
  const navigate = useNavigate();
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
            onClick={() => navigate("/medications")}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Volver
          </button>
        </div>

        <Select
          label="Medicamento"
          value={name}
          onChange={setName}
          options={meds}
        />

        <h1></h1>
        
        <Select
          label="Dosis"
          value={dose}
          onChange={setDose}
          options={doses}
        />

        <button
          className="primaryBtn wide"
          onClick={() => navigate("/medications")}
        >
          Guardar
        </button>
      </div>
    </>
  );
}