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

export default function SegDiario() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [emotions, setEmotions] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [showOk, setShowOk] = useState(false);

  const EMOTIONS = ["Abrumada", "Miedo y preocupación", "Estrés y ansiedad", "Esperanza", "Ira", "Tristeza y depresión", "Gratitud", "Soledad", "Culpa"];
  const SYMPTOMS = ["Vómito", "Diarrea", "Cansancio", "Fatiga", "Alopecia", "Fiebre"];

  const toggle = (arr, setArr, item) => {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  };

  const handleSave = () => {
    saveEvent({
      id: crypto.randomUUID?.() || String(Date.now()),
      type: "daily",
      date,
      emotions,
      symptoms,
      notes,
    });
    setShowOk(true);
  };

  return (
    <>
      <TopBar onMenuClick={openMenu} />

      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Seguimiento emocional</h1>
          <button className="linkBtn" onClick={() => navigate("/lineaTiempo")}>Volver</button>
        </div>

        <div className="field">
          <div className="label">Fecha:</div>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="field">
          <div className="label">¿Cómo te sientes el día de hoy?</div>
          <div className="checkGrid">
            {EMOTIONS.map((e) => (
              <label className="checkItem" key={e}>
                <input type="checkbox" checked={emotions.includes(e)} onChange={() => toggle(emotions, setEmotions, e)} />
                <span>{e}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="label">¿Tuviste alguno de estos síntomas hoy?</div>
          <div className="checkGrid">
            {SYMPTOMS.map((s) => (
              <label className="checkItem" key={s}>
                <input type="checkbox" checked={symptoms.includes(s)} onChange={() => toggle(symptoms, setSymptoms, s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
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