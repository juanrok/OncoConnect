export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      minWidth: "200vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, Arial",
      background: "#ffd9ef",
      color: "#280b0b",
      padding: 24
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>¿Fuiste diagnosticada con cancer de mama?</h1>
        <p style={{ opacity: 0.85, fontSize: 18, marginTop: 12 }}>
          ¡Aquí te contamos que hacer!
        </p>
      </div>
    </main>
  );
}