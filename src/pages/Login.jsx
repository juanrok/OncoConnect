import { useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import TopBar from "../components/TopBar";

export default function Login() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const topMessage = useMemo(() => {
    if (searchParams.get("registered") === "1") {
      return "Cuenta creada. Ya puedes iniciar sesión.";
    }
    return "";
  }, [searchParams]);

  function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  async function handleLogin() {
    setError("");
    setInfo("");
    setUnverifiedEmail("");

    if (!email.trim() || !pass.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.code === "EMAIL_NOT_VERIFIED") {
          setUnverifiedEmail(data.email || email.trim());
        }
        setError(data?.message || "No se pudo iniciar sesión.");
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

  async function handleResend() {
    const targetEmail = unverifiedEmail || email.trim();
    if (!targetEmail) return;

    setResendLoading(true);
    setInfo("");
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      setInfo(data?.message || "Solicitud procesada.");
    } catch {
      setError("No se pudo reenviar el correo.");
    } finally {
      setResendLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError("");
    setInfo("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "No se pudo iniciar con Google.");
        return;
      }

      saveSession(data);
      navigate("/welcome");
    } catch {
      setError("Error conectando con el servidor.");
    }
  }

  return (
    <>
      <TopBar onMenuClick={openMenu} />
      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Inicia sesión</h1>
          <button className="linkBtn" onClick={() => navigate("/")}>
            Volver
          </button>
        </div>

        {topMessage ? (
          <div style={{ marginTop: 10, color: "#0a7a2f", fontSize: 12 }}>{topMessage}</div>
        ) : null}

        <div className="field">
          <div className="label">Correo</div>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="field">
          <div className="label">Contraseña</div>
          <input
            className="input"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="********"
          />
        </div>

        {error ? (
          <div style={{ marginTop: 10, color: "#b00020", fontSize: 12 }}>{error}</div>
        ) : null}

        {info ? (
          <div style={{ marginTop: 10, color: "#0a7a2f", fontSize: 12 }}>{info}</div>
        ) : null}

        {unverifiedEmail ? (
          <button
            className="primaryBtn wide"
            style={{ marginTop: 12 }}
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? "Reenviando..." : "Reenviar correo de verificación"}
          </button>
        ) : null}

        <div className="miniCenter">
          <span className="tinyText">
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </span>
        </div>

        <button className="primaryBtn wide" onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <div className="miniCenter" style={{ marginTop: 14 }}>
          <span className="tinyText">O inicia sesión con:</span>
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Falló el inicio con Google.")}
            useOneTap={false}
          />
        </div>
      </div>
    </>
  );
}