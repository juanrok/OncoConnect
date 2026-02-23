export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      minWidth: "200vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, Arial",
      background: "#0b1220",
      color: "white",
      padding: 24
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>Hola Buenas Admins :)</h1>
        <p style={{ opacity: 0.85, fontSize: 18, marginTop: 12 }}>
          Bases preliminares para el proyecto establecidas :)
        </p>
      </div>
    </main>
  );
}