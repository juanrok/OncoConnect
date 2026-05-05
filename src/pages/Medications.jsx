import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";
import MedicationCard from "../components/MedicationCard";
import { medicationsService } from "../services/medications";

export default function Medications() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSymptoms, setShowSymptoms] = useState({});

  useEffect(() => {
    loadMedications();
  }, []);

  async function loadMedications() {
    try {
      setLoading(true);
      setError("");
      const data = await medicationsService.getAll();
      setMedications(data);
    } catch (err) {
      console.error("Error loading medications:", err);
      setError(err.message || "No se pudieron cargar los medicamentos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Estás segura de que quieres eliminar este medicamento?")) return;

    try {
      await medicationsService.delete(id);
      setMedications((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting medication:", err);
      setError(err.message || "No se pudo eliminar el medicamento.");
    }
  }

  return (
    <>
      <TopBar onMenuClick={openMenu} />

      <div className="content">
        <div className="rowBetween">
          <h1 style={{ margin: "14px 0 8px" }}>Registro de medicamentos</h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 800,
              color: "rgba(43,15,16,0.8)",
            }}
          >
            Volver
          </button>
        </div>

        <p>
          Este espacio tiene como propósito registrar los medicamentos que estas
          consumiendo para tu tratamiento, y documentar la forma en la que te
          afectan.
        </p>

        <button
          className="primaryBtn"
          onClick={() => navigate("/medications/new")}
        >
          Añadir medicamento
        </button>

        {error && (
          <div
            style={{
              backgroundColor: "#ffe0e0",
              color: "#c00",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            {error}
          </div>
        )}

        <div className="sectionTitle">Tus medicamentos</div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>Cargando...</div>
        ) : medications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", opacity: 0.7 }}>
            No tienes medicamentos registrados aún.
          </div>
        ) : (
          <div className="symptomsWrap" style={{ marginTop: 10 }}>
            {medications.map((med) => (
              <div key={med._id}>
                {showSymptoms[med._id] && (
                  <div className="popover">
                    <div className="popTitle">
                      Información de {med.name}
                    </div>
                    <div className="popText">
                      <strong>Dosis:</strong> {med.dose || "No especificada"}
                      <br />
                      <strong>Frecuencia:</strong> {med.frequency || "No especificada"}
                      <br />
                      <strong>Notas:</strong> {med.notes || "Sin notas"}
                    </div>
                  </div>
                )}

                <MedicationCard
                  name={med.name}
                  dose={med.dose}
                  frequency={med.frequency}
                  onAskSymptoms={() =>
                    setShowSymptoms((prev) => ({
                      ...prev,
                      [med._id]: !prev[med._id],
                    }))
                  }
                  onDelete={() => handleDelete(med._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}