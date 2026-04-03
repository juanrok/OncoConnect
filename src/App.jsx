/*export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      minWidth: "200vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, Arial",
      background: "#ffd9ef",
      color: "#280b0b",
      padding: 24
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>¿Fuiste diagnosticada con cancer de mama?</h1>
        <p style={{ opacity: 0.85, fontSize: 18, marginTop: 12 }}>
          ¡Aquí te contamos que hacer!
        </p>
      </div>
    </main>
  );
}
  */

/*
import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | meds | add

  if (screen === "home") {
    return <Home onGoMeds={() => setScreen("meds")} />;
  }

  return (
    <div className="appShell">
      <div className="appFrame">
        {screen === "meds" ? (
          <Medications
            onGoAdd={() => setScreen("add")}
            onBackHome={() => setScreen("home")}
          />
        ) : (
          <AddMedication
            onBack={() => setScreen("meds")}
          />
        )}
      </div>
    </div>
  );
}

*/
import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";

import Login from "./pages/Login";
import Name from "./pages/Name";
import Welcome from "./pages/Welcome";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | meds | add | login | name | welcome
  const [userName, setUserName] = useState("Nombre");

  if (screen === "home") {
    return (
      <Home
        onGoMeds={() => setScreen("meds")}
        onGoRoadmap={() => setScreen("login")}
      />
    );
  }

  // Medicamentos
  if (screen === "meds") {
    return (
      <div className="appShell">
        <div className="appFrame">
          <div className="canvas">
            <Medications
            onGoAdd={() => setScreen("add")}
            onBackHome={() => setScreen("home")}
            />
          </div>
        </div>
      </div>
    );
  }

  if (screen === "add") {
    return (
      <div className="appShell">
        <div className="appFrame">
          <div className="canvas">
            <AddMedication onBack={() => setScreen("meds")} />
          </div>
        </div>
      </div>
    );
  }

  // Hoja de ruta (flujo login → nombre → bienvenida)
  if (screen === "login") {
    return (
      <div className="appShell">
        <div className="appFrame">
          <div className="canvas">
            <Login onBack={() => setScreen("home")} onNext={() => setScreen("name")} />
          </div>
        </div>
      </div>
    );
  }

  if (screen === "name") {
    return (
      <div className="appShell">
        <div className="appFrame">
          <div className="canvas">
            <Name
              onBack={() => setScreen("login")}
              onNext={() => setScreen("welcome")}
              onSetName={setUserName}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appShell">
      <div className="appFrame">
        <div className="canvas">
          <Welcome
            userName={userName}
            onBack={() => setScreen("name")}
            onStart={() => setScreen("home")}
          />
        </div>
      </div>
    </div>
  );
}