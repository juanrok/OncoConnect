import { useState } from "react";
import TopBar from "../components/TopBar";

export default function Login({ onBack, onNext }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <>
      <TopBar />
      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Inicia sesión</h1>
          <button className="linkBtn" onClick={onBack}>Volver</button>
        </div>

        <div className="field">
          <div className="label">Correo</div>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="field">
          <div className="label">Contraseña</div>
          <input
            className="input"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="miniCenter">
          <span className="tinyText">¿No tienes una cuenta? Registrate</span>
        </div>

        <button className="primaryBtn wide" onClick={onNext}>
          Iniciar sesión
        </button>

        <div className="miniCenter" style={{ marginTop: 14 }}>
          <span className="tinyText">O inicia sesión con:</span>
        </div>

        <div className="socialRow">
          <button className="socialBtn" aria-label="Google">
            <span className="socialIcon">G</span>
          </button>
          <button className="socialBtn" aria-label="Facebook">
            <span className="socialIcon">f</span>
          </button>
        </div>
      </div>
    </>
  );
}