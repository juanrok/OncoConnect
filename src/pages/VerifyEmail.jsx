import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verificando tu correo...");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Falta el token de verificación.");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data?.message || "No se pudo verificar el correo.");
          return;
        }

        setStatus("success");
        setMessage(data?.message || "Correo verificado correctamente.");
      } catch {
        setStatus("error");
        setMessage("Error conectando con el servidor.");
      }
    }

    verify();
  }, [token]);

  return (
    <>
      <TopBar />
      <div className="content">
        <h1 style={{ fontSize: 24 }}>
          {status === "loading"
            ? "Verificando correo"
            : status === "success"
            ? "Correo verificado"
            : "No se pudo verificar"}
        </h1>

        <p>{message}</p>

        <button className="primaryBtn wide" onClick={() => navigate("/login")}>
          Ir a iniciar sesión
        </button>
      </div>
    </>
  );
}