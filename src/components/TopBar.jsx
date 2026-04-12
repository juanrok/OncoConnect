import logo from "../assets/logo_onco.png";
export default function TopBar() {
  return (
    <header className="topbar">
      <div className="logoCircle" aria-label="OncoConnect logo">
        <img src={logo} alt="OncoConnect logo" style={{ width: 17, height: 17}}/>
      </div>

      <div className="hamburger" aria-label="menu">
        <span />
        <span />
        <span />
      </div>
    </header>
  );
}