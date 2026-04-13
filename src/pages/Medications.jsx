import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";
import MedicationCard from "../components/MedicationCard";

export default function Medications() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();
  const [showSymptoms, setShowSymptoms] = useState(false);

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

        <div className="sectionTitle">Tus medicamentos</div>

        <div className="symptomsWrap" style={{ marginTop: 10 }}>
          {showSymptoms && (
            <div className="popover">
              <div className="popTitle">
                Posibles síntomas al consumir Neratinib
              </div>
              <div className="popText">
                infecciones, náuseas, fatiga, diarrea, vómitos, dolor de cabeza,
                estreñimiento, alopecia, tos, erupción, dolor de espalda
              </div>
            </div>
          )}

          <MedicationCard
            name="Neratinib"
            dose="240mg"
            frequency="una vez al día con el desayuno en la mañana"
            onAskSymptoms={() => setShowSymptoms((v) => !v)}
          />
        </div>
      </div>
    </>
  );
}