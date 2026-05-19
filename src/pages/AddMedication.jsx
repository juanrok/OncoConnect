import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";
import Select from "../components/Select";
import { medicationsService } from "../services/medications";

export default function AddMedication() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { openMenu } = useOutletContext();

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
  
  const frequencies = [
    "una vez al día",
    "dos veces al día",
    "tres veces al día",
    "cada 12 horas",
    "cada 8 horas",
    "según sea necesario",
  ];

  async function handleSave() {
    setError("");

    if (!name.trim()) {
      setError("El nombre del medicamento es requerido.");
      return;
    }

    try {
      setLoading(true);
      await medicationsService.create({
        name: name.trim(),
        dose: dose.trim(),
        frequency: frequency.trim(),
        notes: notes.trim(),
        startDate: new Date(),
      });
      navigate("/medications");
    } catch (err) {
      console.error("Error saving medication:", err);
      setError(err.message || "No se pudo guardar el medicamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar onMenuClick={openMenu} />

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

        {error && (
          <div
            style={{
              backgroundColor: "#ffe0e0",
              color: "#c00",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            {error}
          </div>
        )}

        <Select
          label="Medicamento"
          value={name}
          onChange={setName}
          options={meds}
        />

        <Select
          label="Dosis"
          value={dose}
          onChange={setDose}
          options={doses}
        />

        <Select
          label="Frecuencia"
          value={frequency}
          onChange={setFrequency}
          options={frequencies}
        />

        <div className="field">
          <div className="label">Notas (opcional)</div>
          <textarea
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Tomar con comida, efectos secundarios, etc."
            style={{ minHeight: "80px", fontFamily: "inherit" }}
          />
        </div>

        <button
          className="primaryBtn wide"
          onClick={handleSave}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </>
  );
}