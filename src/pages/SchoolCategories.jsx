import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";

export default function SchoolCategories() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  return (
    <>
      <TopBar onMenuClick={openMenu} />

      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>
            Escuela del cuidado
          </h1>

          <button className="linkBtn" onClick={() => navigate("/school")}>
            Volver
          </button>
        </div>

        <p style={{ marginTop: 10, textAlign: "center" }}>
          Selecciona la categoría sobre la cual tienes dudas y te interesa aprender
        </p>

        <div className="catGrid">
          <button className="catCard catDark" onClick={() => navigate("/school/topic/enfermedad")}>
            <div className="catIcon">🏥</div>
            <div className="catLabel">Comprende la enfermedad</div>
          </button>

          <button className="catCard catLight" onClick={() => navigate("/school/topic/diagnostico")}>
            <div className="catIcon">🖥️</div>
            <div className="catLabel">Diagnóstico y detección</div>
          </button>

          <button className="catCard catDark" onClick={() => navigate("/school/topic/tratamientos")}>
            <div className="catIcon">💉</div>
            <div className="catLabel">Conoce sobre los tratamientos</div>
          </button>

          <button className="catCard catLight" onClick={() => navigate("/school/topic/bienestar")}>
            <div className="catIcon">🩹</div>
            <div className="catLabel">Efectos secundarios y bienestar</div>
          </button>
        </div>
      </div>
    </>
  );
}