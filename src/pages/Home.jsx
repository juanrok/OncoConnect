import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, Arial",
        background: "#ffd9ef",
        color: "#280b0b",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>
          ¿Fuiste diagnosticada con cancer de mama?
        </h1>

        <p style={{ opacity: 0.85, fontSize: 18, marginTop: 12 }}>
          ¡Aquí te contamos que hacer!
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: 12,
            background: "#e1006a",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: 999,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Iniciar
        </button>

        <button
          onClick={() => navigate("/medications")}
          style={{
            marginTop: 12,
            marginLeft: 10,
            background: "white",
            color: "#e1006a",
            border: "1px solid #e1006a",
            padding: "12px 18px",
            borderRadius: 999,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Medicamentos
        </button>
      </div>
    </main>
  );
}