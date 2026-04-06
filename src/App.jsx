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
      <h1 style={{ marginTop: 0 }}>OncoConnect</h1>

      <section style={{ marginTop: 18 }}>
        <h2>Estado de la API</h2>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
          {health ? JSON.stringify(health, null, 2) : "Cargando..."}
        </pre>
      </section>

      <section
        style={{
          marginTop: 24,
          background: "#fafafa",
          padding: 16,
          borderRadius: 12,
          border: "1px solid #e5e5e5",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Crear paciente de prueba</h2>

        <form onSubmit={createPatient}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <label>
              Nombre
              <input
                type="text"
                value={form.givenName}
                onChange={(e) => updateForm("givenName", e.target.value)}
                placeholder="Ana"
                style={{ width: "93%", padding: 10, marginTop: 6, borderRadius: 12, border: "1px solid #e5e5e5"}}
                
              />
            </label>

            <label>
              Apellido
              <input
                type="text"
                value={form.familyName}
                onChange={(e) => updateForm("familyName", e.target.value)}
                placeholder="Pérez"
                style={{ width: "93%", padding: 10, marginTop: 6, borderRadius: 12, border: "1px solid #e5e5e5"}}
              />
            </label>

            <label>
              Género
              <select
                value={form.gender}
                onChange={(e) => updateForm("gender", e.target.value)}
                style={{ width: "101%", padding: 10, marginTop: 6, borderRadius: 12, border: "1px solid #e5e5e5" }}
              >
                <option value="noi">No informa</option>
                <option value="hombre">Masculino</option>
                <option value="mujer">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </label>

            <label>
              Fecha de nacimiento
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => updateForm("birthDate", e.target.value)}
                style={{ width: "93%", padding: 10, marginTop: 6, borderRadius: 12, border: "1px solid #e5e5e5" }}
              />
            </label>

            <label>
              MRN
              <input
                type="text"
                value={form.mrn}
                onChange={(e) => updateForm("mrn", e.target.value)}
                placeholder="MRN-0002"
                style={{ width: "93%", padding: 10, marginTop: 6, borderRadius: 12, border: "1px solid #e5e5e5" }}
              />
            </label>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <button type="submit" disabled={creating} style={{ padding: "10px 16px" }}>
              {creating ? "Creando..." : "Crear paciente"}
            </button>

            {createMessage && (
              <span style={{ fontSize: 14 }}>{createMessage}</span>
            )}
          </div>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Pacientes (FHIR)</h2>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={loadPatients} style={{ padding: "10px 14px" }}>
            Recargar pacientes
          </button>

        </div>

        <ul style={{ marginTop: 12 }}>
          {patients.map((p) => (
            <li key={p.id}>
              <strong>{p.id}</strong> — {patientLabel(p)} — {p.gender || "unknown"} —{" "}
              {p.birthDate || "sin fecha"}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Condiciones del paciente</h2>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Paciente:
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            style={{ padding: 8, borderRadius: 12, border: "1px solid #e5e5e5"   }}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {patientLabel(p)}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => loadConditions(selectedPatientId)}
          style={{ marginTop: 12, padding: "10px 14px" }}
        >
          Recargar condiciones
        </button>

        <ul style={{ marginTop: 12 }}>
          {conditions.map((c) => (
            <li key={c.id}>
              <strong>{c.id}</strong> —{" "}
              {c?.code?.text || c?.code?.coding?.[0]?.display || "Condición"} —{" "}
              {c?.clinicalStatus?.coding?.[0]?.code || "sin status"}
            </li>
          ))}
        </ul>
      </section>
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