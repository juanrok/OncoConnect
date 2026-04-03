import logo from "../assets/lazo.png";
export default function TopBar() {
  return (
    <header className="topbar">
      <div className="logoCircle" aria-label="OncoConnect logo">
        <img src={logo} alt="OncoConnect logo" style={{ width: 20, height: 20 }}/>
      </div>

      <div className="hamburger" aria-label="menu">
        <span />
        <span />
        <span />
      </div>
    </header>
  );
}