import { useState } from "react";
import TopBar from "../components/TopBar";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Name() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  const handleNext = () => {
    localStorage.setItem("userName", name.trim() || "Nombre");
    navigate("/welcome");
  };

  return (
    <>
      <TopBar onMenuClick={openMenu} />
      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
            ¡Hola! Por favor, cuéntanos tu nombre:
          </h1>
          <button className="linkBtn" onClick={() => navigate("/login")}>Volver</button>
        </div>

        <div className="field" style={{ marginTop: 18 }}>
          <input
            className="lineInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Alejandra Salas"
          />
        </div>

        <button
          className="primaryBtn"
          style={{ marginTop: 22 }}
          onClick={handleNext}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}