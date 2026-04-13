import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";

export default function Register() {
  const navigate = useNavigate();
  const {openMenu} =useOutletContext();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister() {
    setError("");

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "No se pudo crear la cuenta.");
        return;
      }

      saveSession(data);
      navigate("/welcome");
    } catch {
      setError("Error conectando con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar onMenuClick={openMenu}/>
      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Crear cuenta</h1>
          <button className="linkBtn" onClick={() => navigate("/")}>
            Volver
          </button>
        </div>

        <div className="field">
          <div className="label">Nombre completo</div>
          <input
            className="input"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Ej. Alejandra Salas"
          />
        </div>

        <div className="field">
          <div className="label">Correo</div>
          <input
            className="input"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="field">
          <div className="label">Contraseña</div>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="********"
          />
        </div>

        {error ? (
          <div style={{ marginTop: 10, color: "#b00020", fontSize: 12 }}>{error}</div>
        ) : null}

        <div className="miniCenter">
          <span className="tinyText">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </span>
        </div>

        <button className="primaryBtn wide" onClick={handleRegister} disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </div>
    </>
  );
}