import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";

const STORAGE_KEY = "lineaTiempoEvents";

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function LineaTiempo() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  const [openSheet, setOpenSheet] = useState(false);
  const [choice, setChoice] = useState("daily");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const timeline = useMemo(() => {
    return [...events].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [events]);

  return (
    <>
      <TopBar onMenuClick={openMenu} />

      <div className="content">
        <div className="roadmapHeader">
          <div className="tinyText" style={{ marginTop: 4 }}>Esta es tu hoja de ruta:</div>

          <button className="addEventBtn" onClick={() => setOpenSheet(true)}>
            <span className="addPlus">+</span> Añadir evento
          </button>
        </div>

        <div className="timeline">
          <div className="tRow">
            <div className="tLeft">
              <div className="tDot" />
              <div className="tLine" />
            </div>
            <div className="tRight">
              <div className="tTitle">Día 0</div>
              <div className="tSub">Día aproximado de diagnóstico</div>
            </div>
          </div>

          {timeline.length === 0 ? (
            <div className="tinyText" style={{ marginTop: 14 }}>
              Aún no tienes eventos. Presiona “Añadir evento”.
            </div>
          ) : (
            timeline.map((ev) => (
              <div className="tRow" key={ev.id}>
                <div className="tLeft">
                  <div className="tDot strong" />
                  <div className="tLine" />
                </div>

                <div className="tRight">
                  <div className="tDate">[{ev.date || "Fecha"}]</div>

                  <div className="tTitle">
                    {ev.type === "daily" ? "Seguimiento emocional" : "Seguimiento médico"}
                  </div>

                  {ev.type === "daily" ? (
                    <>
                      <div className="tMini">Emociones: {ev.emotions?.slice(0, 3)?.join(", ") || "—"}</div>
                      <div className="tMini">Síntomas: {ev.symptoms?.slice(0, 3)?.join(", ") || "—"}</div>
                    </>
                  ) : (
                    <>
                      <div className="tMini">Tratamiento/Cita: {ev.treatment || "—"}</div>
                      <div className="tMini">Lugar: {ev.place || "—"}</div>
                    </>
                  )}

                  <button
                    className="pillLink"
                    onClick={() => navigate("/lineaTiempo/panelRecomendaciones")}
                  >
                    ver recomendaciones
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {openSheet && (
        <div className="sheetOverlay" onClick={() => setOpenSheet(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheetTitle">¿Qué tipo de evento quieres añadir?</div>

            <label className="sheetOption">
              <input
                type="radio"
                checked={choice === "daily"}
                onChange={() => setChoice("daily")}
              />
              <div>
                <div className="sheetOptName">Seguimiento diario</div>
                <div className="sheetOptDesc">Cómo te sientes, tus síntomas, notas adicionales, etc.</div>
              </div>
            </label>

            <label className="sheetOption">
              <input
                type="radio"
                checked={choice === "medical"}
                onChange={() => setChoice("medical")}
              />
              <div>
                <div className="sheetOptName">Seguimiento de tu tratamiento</div>
                <div className="sheetOptDesc">Citas médicas, exámenes, dónde y cuándo, recomendaciones…</div>
              </div>
            </label>

            <button
              className="primaryBtn wide"
              onClick={() => {
                setOpenSheet(false);
                navigate(choice === "daily"
                  ? "/lineaTiempo/segDiario"
                  : "/lineaTiempo/segMedico"
                );
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
}