import { useEffect, useState } from "react";

function bundleToResources(bundle) {
  return (bundle?.entry || []).map((e) => e.resource).filter(Boolean);
}

function patientLabel(p) {
  if (!p?.name?.[0]) return p.id;
  const n = p.name[0];
  return `${(n.given || []).join(" ")} ${n.family || ""}`.trim();
}

export default function App() {
  const [health, setHealth] = useState(null);

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("pt-001");
  const [conditions, setConditions] = useState([]);

  const [form, setForm] = useState({
    givenName: "",
    familyName: "",
    gender: "unknown",
    birthDate: "",
    mrn: "",
  });

  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  async function loadHealth() {
    const res = await fetch("/api/health");
    const data = await res.json();
    setHealth(data);
  }

  async function loadPatients() {
    const res = await fetch("/fhir/Patient");
    const bundle = await res.json();
    const list = bundleToResources(bundle);
    setPatients(list);

    if (!selectedPatientId && list.length > 0) {
      setSelectedPatientId(list[0].id);
    }
  }

  async function loadConditions(patientId) {
    if (!patientId) {
      setConditions([]);
      return;
    }

    const res = await fetch(`/fhir/Condition?patient=${encodeURIComponent(patientId)}`);
    const bundle = await res.json();
    setConditions(bundleToResources(bundle));
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function createPatient(e) {
    e.preventDefault();
    setCreateMessage("");

    if (!form.givenName.trim() || !form.familyName.trim()) {
      setCreateMessage("Debes llenar nombre y apellido.");
      return;
    }

    setCreating(true);

    const mrnValue =
      form.mrn.trim() || `MRN-${Date.now().toString().slice(-6)}`;

    const patientResource = {
      resourceType: "Patient",
      meta: {
        profile: [
          "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-patient",
        ],
      },
      identifier: [
        {
          system: "http://example.org/mrn",
          value: mrnValue,
        },
      ],
      name: [
        {
          use: "official",
          family: form.familyName.trim(),
          given: [form.givenName.trim()],
        },
      ],
      gender: form.gender,
      birthDate: form.birthDate || undefined,
    };

    try {
      const res = await fetch("/fhir/Patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/fhir+json",
        },
        body: JSON.stringify(patientResource),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.issue?.[0]?.diagnostics || "No se pudo crear el paciente.";
        setCreateMessage(msg);
        return;
      }

      setCreateMessage(`Paciente creado: ${patientLabel(data)} (${data.id})`);

      setForm({
        givenName: "",
        familyName: "",
        gender: "unknown",
        birthDate: "",
        mrn: "",
      });

      await loadPatients();
      setSelectedPatientId(data.id);
      await loadConditions(data.id);
    } catch (error) {
      setCreateMessage("Error conectando con el backend.");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    loadHealth();
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadConditions(selectedPatientId);
    }
  }, [selectedPatientId]);

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