import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";

export default function CheckEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data?.message || "Solicitud procesada.");
    } catch {
      setMessage("No se pudo reenviar el correo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar />
      <div className="content">
        <h1 style={{ fontSize: 24 }}>Revisa tu correo</h1>
        <p>
          Te enviamos un enlace de verificación a <strong>{email || "tu correo"}</strong>.
        </p>

        <button className="primaryBtn wide" onClick={handleResend} disabled={loading}>
          {loading ? "Reenviando..." : "Reenviar correo"}
        </button>

        {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}

        <button
          className="linkBtn"
          style={{ marginTop: 16 }}
          onClick={() => navigate("/login")}
        >
          Ir a iniciar sesión
        </button>
      </div>
    </>
  );
}