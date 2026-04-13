import logo from "../assets/logo_onco.png";
export default function TopBar({ onMenuClick }) {
  return (
    <header className="topbar">
      <div className="logoCircle" aria-label="OncoConnect logo">
        <img src={logo} alt="OncoConnect logo" style={{ width: 17, height: 17}}/>
      </div>

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
    </header>
  );
}