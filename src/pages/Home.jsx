export default function Home({ onGoMeds, onGoRoadmap }) {
  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, Arial",
      background: "#ffd9ef",
      color: "#280b0b",
      padding: 24
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>
          ¿Fuiste diagnosticada con cancer de mama?
        </h1>

        <p style={{ opacity: 0.85, fontSize: 18, marginTop: 12 }}>
          ¡Aquí te contamos que hacer!
        </p>

        <button
        onClick={onGoRoadmap}
        style={{
            marginTop: 12,
            background: "#e1006a",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: 999,
            fontWeight: 800,
            cursor: "pointer",
            width: "fit-content"
        }}
        >
        Accede a nuestra hoja de ruta
        </button>
        <button
          onClick={onGoMeds}
          style={{
            marginTop: 18,
            background: "#e1006a",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: 999,
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          Ir a Medicamentos
        </button>
      </div>
    </main>
  );
}