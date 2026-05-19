import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";

const STORAGE_KEY = "lineaTiempoEvents";

function saveEvent(ev) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(ev);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export default function SegMedico() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [treatment, setTreatment] = useState("");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [showOk, setShowOk] = useState(false);

  const handleSave = () => {
    saveEvent({
      id: crypto.randomUUID?.() || String(Date.now()),
      type: "medical",
      date,
      treatment,
      place,
      notes,
      files: files.map(f => f.name),
    });
    setShowOk(true);
  };

  return (
    <>
      <TopBar onMenuClick={openMenu} />

      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Seguimiento médico</h1>
          <button className="linkBtn" onClick={() => navigate("/lineaTiempo")}>Volver</button>
        </div>

        <div className="field">
          <div className="label">Fecha del tratamiento/cita médica:</div>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="field">
          <div className="label">¿Qué tratamiento/cita médica tienes?</div>
          <input className="lineInput" value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="Escribe aquí..." />
        </div>

        <div className="field">
          <div className="label">¿Dónde es tu tratamiento/cita?</div>
          <input className="lineInput" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ej. Clínica los Cobos" />
        </div>

        <div className="mapMock">Mapa (placeholder)</div>

        <div className="field">
          <div className="label">Adjuntar archivos (opcional)</div>
          <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          {files.length > 0 && (
            <div className="tinyText" style={{ marginTop: 6 }}>
              {files.map(f => f.name).join(", ")}
            </div>
          )}
        </div>

        <div className="field">
          <div className="label">Notas adicionales</div>
          <textarea className="textArea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Escribe aquí..." />
        </div>

        <button className="primaryBtn wide" onClick={handleSave}>Guardar</button>
      </div>

      {showOk && (
        <div className="modalOverlay" onClick={() => setShowOk(false)}>
          <div className="okModal" onClick={(e) => e.stopPropagation()}>
            <div className="okTitle">¡Listo!</div>
            <div className="tinyText">Seguimiento guardado con éxito</div>
            <button className="primaryBtn wide" onClick={() => navigate("/lineaTiempo")}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}