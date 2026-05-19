import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";

export default function PanelRecomendaciones() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  return (
    <>
      <TopBar onMenuClick={openMenu} />

      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Recomendaciones</h1>
          <button className="linkBtn" onClick={() => navigate("/lineaTiempo")}>Volver</button>
        </div>

        <div className="recoPanel">
          <div className="recoTitle">Recomendaciones generales</div>
          <ul className="recoList">
            <li>Hidrátate y prioriza descanso.</li>
            <li>Registra síntomas nuevos o persistentes.</li>
            <li>Si un síntoma empeora, consulta a tu equipo médico.</li>
          </ul>

          <div className="recoTitle" style={{ marginTop: 14 }}>
            Recomendaciones específicas de tu tratamiento
          </div>
          <ul className="recoList">
            <li>Revisa horarios de medicamentos y comidas.</li>
            <li>Confirma fecha/lugar de exámenes y lleva documentos.</li>
            <li>Guarda resultados para llevarlos a consulta.</li>
          </ul>
        </div>
      </div>
    </>
  );
}