import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";
import welcomePeople from "../assets/bienvenida.jpg";

export default function Welcome() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();

  const userName = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      return user?.fullName || "Usuario";
    } catch {
      return "Usuario";
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <>
      <TopBar onMenuClick={openMenu} />
      <div className="content">
        <div className="rowBetween" style={{ marginTop: 8 }}>
          <div />
          <button className="linkBtn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        <h1 style={{ marginTop: 10, fontSize: 16, fontWeight: 900 }}>
          ¡Bienvenida, {userName}! Nos alegra que formes parte de nuestra comunidad.
        </h1>

        <div className="welcomeArt" aria-label="Ilustración comunidad">
          <img src={welcomePeople} alt="Comunidad diversa" className="welcomeImg" />
        </div>

        <p style={{ marginTop: 10, textAlign: "center" }}>
          En OncoConnect, estamos aquí para brindarte todo el apoyo necesario durante tu proceso.
          Desde orientación y autocuidado hasta acceso a la salud, estamos contigo en cada paso.
        </p>

        <button
          className="primaryBtn"
          style={{ marginTop: 18 }}
          onClick={() => navigate("/medications")}
        >
          Iniciar
        </button>
      </div>
    </>
  );
}