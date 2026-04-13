{/*}
import "./App.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import MenuDrawer from "./components/Menubox";

import Home from "./pages/Home";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import Login from "./pages/Login";
import Name from "./pages/Name";
import Welcome from "./pages/Welcome";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Nombre");

  const go = (next) => {
    setScreen(next);
    setMenuOpen(false);
  };

  // HOME
  if (screen === "home") {
    return (
      <>
        <Home onOpenMenu={() => setMenuOpen(true)} />
        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} />
      </>
    );
  }

  return (
    <div className="appShell">
      <div className="appFrame">
        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} />

        {screen === "meds" && (
          <Medications
            onGoAdd={() => go("add")}
            onBackHome={() => go("home")}
            onOpenMenu={() => setMenuOpen(true)}
          />
        )}

        {screen === "add" && (
          <AddMedication
            onBack={() => go("meds")}
            onOpenMenu={() => setMenuOpen(true)}
          />
        )}

        {screen === "login" && (
          <Login
            onBack={() => go("home")}
            onNext={() => go("name")}
            onOpenMenu={() => setMenuOpen(true)}
          />
        )}

        {screen === "name" && (
          <Name
            onBack={() => go("login")}
            onNext={() => go("welcome")}
            onSetName={setUserName}
            onOpenMenu={() => setMenuOpen(true)}
          />
        )}

        {screen === "welcome" && (
          <Welcome
            userName={userName}
            onBack={() => go("name")}
            onStart={() => go("home")}
            onOpenMenu={() => setMenuOpen(true)}
          />
        )}
      </div>
    </div>
  );
}
*/}

import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import MenuDrawer from "./components/Menubox";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="appShell">
      <div className="appFrame">
        <MenuDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavigate={go}
        />
        <div className="canvas">
         
          <Outlet context={{ openMenu: () => setMenuOpen(true) }} />
        </div>
      </div>
    </div>
  );
}