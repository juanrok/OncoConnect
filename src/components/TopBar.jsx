import logo from "../assets/logo_onco.png";
import { useNavigate } from "react-router-dom";

export default function TopBar({ onMenuClick, isPublic = true }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="logoCircle" aria-label="OncoConnect logo">
        <img src={logo} alt="OncoConnect logo" style={{ width: 17, height: 17}}/>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isPublic && (
          <button
            type="button"
            onClick={() => navigate("/login")}
            aria-label="Ir a login"
            className="loginBtn"
          >
            Acceder
          </button>
        )}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <div className="hamburger" aria-label="menu">
            <span />
            <span />
            <span />
          </div>
        </button>
      </div>
    </header>
  );
}