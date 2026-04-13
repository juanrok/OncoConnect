import { useNavigate, useOutletContext } from "react-router-dom";
import logo from "../assets/logo_onco.png";

export default function Home() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, Arial",
        //background: "#ffd9ef",
        color: "#280b0b",
        padding: 24,
      }}
    >
      
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <img 
          src={logo} 
          alt="Lazo cáncer de mama" 
          style={{ width: 150, marginBottom: 10 }} 
        />
        <h1 style={{ fontSize: 28, margin: 10, fontWeight: "bold", lineHeight: 1 }}>
          <span style={{ color: "#e1006a", fontWeight: "bold" }}>
            OncoConnect
          </span>{" "}
          es tu espacio de apoyo durante el tratamiento de cancer de mama
        </h1>

        <p style={{ opacity: 1, fontSize: 18, marginTop: 16 }}>
          Haz seguimiento a tu proceso y accede a herramientas diseñadas para acompañarte
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: 30,
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

        
      </div>
    </main>
  );
}