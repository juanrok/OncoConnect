const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const { connectDB } = require("./db");
const FhirResource = require("./models/FhirResource");
const authRoutes = require("./routes/auth");
const medicationRoutes = require("./routes/medications");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(
  express.json({
    limit: "1mb",
    type: ["application/json", "application/fhir+json"]
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);

// para front: fetch("/fhir/...")
app.use("/fhir", (req, res, next) => {
  res.type("application/fhir+json");
  next();
});

const now = () => new Date().toISOString();
const ALLOWED_TYPES = new Set(["Patient", "Condition", "Observation"]);
const ID_PREFIX = {
  Patient: "pt",
  Condition: "cond",
  Observation: "obs",
};

function makeId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function outcome(statusCode, diagnostics, code = "invalid", severity = "error") {
  return {
    resourceType: "OperationOutcome",
    issue: [{ severity, code, diagnostics }],
  };
}

function asBundle(resources, baseUrl) {
  return {
    resourceType: "Bundle",
    type: "searchset",
    total: resources.length,
    entry: resources.map((r) => ({
      fullUrl: `${baseUrl}/fhir/${r.resourceType}/${r.id}`,
      resource: r,
    })),
  };
}

async function nextSequentialId(resourceType) {
  const prefix = ID_PREFIX[resourceType];
  if (!prefix) throw new Error(`No hay prefijo para ${resourceType}`);

  const docs = await FhirResource.find({ resourceType }).lean();

  let max = 0;

  for (const doc of docs) {
    const id = doc.resourceId || "";
    const regex = new RegExp(`^${prefix}-(\\d+)$`);
    const match = id.match(regex);

    if (match) {
      const num = Number(match[1]);
      if (!Number.isNaN(num) && num > max) {
        max = num;
      }
    }
  }

  const next = max + 1;
  return `${prefix}-${String(next).padStart(6, "0")}`;
}

async function upsert(resource) {
  if (!resource || typeof resource !== "object") throw new Error("Body inválido");
  if (!resource.resourceType) throw new Error("Falta resourceType");
  if (!ALLOWED_TYPES.has(resource.resourceType)) throw new Error(`resourceType no soportado: ${resource.resourceType}`);

  if (!resource.id) resource.id = await nextSequentialId(resource.resourceType);
  resource.meta = { ...(resource.meta || {}), lastUpdated: now() };

  await FhirResource.findOneAndUpdate(
    { resourceType: resource.resourceType, resourceId: resource.id },
    { resourceType: resource.resourceType, resourceId: resource.id, resource },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return resource;
}

async function readOne(type, id) {
  const doc = await FhirResource.findOne({ resourceType: type, resourceId: id }).lean();
  return doc?.resource || null;
}

async function listByType(type) {
  const docs = await FhirResource.find({ resourceType: type }).lean();
  return docs.map((d) => d.resource);
}

// Seed sintético - esto solo lo hace cuando la bd esta vacía para q no explote
async function seedIfEmpty() {
  const count = await FhirResource.countDocuments({ resourceType: "Patient" });
  if (count > 0) return;

  const patient = await upsert({
    resourceType: "Patient",
    id: "pt-000001",
    meta: {
      profile: ["http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-patient"],
    },
    identifier: [{ system: "http://example.org/mrn", value: "MRN-0001" }],
    name: [{ use: "official", family: "Paciente", given: ["Demo"] }],
    gender: "unknown",
    birthDate: "1990-01-01",
  });

  const condition = await upsert({
    resourceType: "Condition",
    id: "cond-000001",
    meta: {
      profile: ["http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-primary-cancer-condition"],
    },
    clinicalStatus: {
      coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }],
    },
    verificationStatus: {
      coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed" }],
    },
    category: [
      { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-category", code: "problem-list-item" }] },
    ],
    code: {
      coding: [{ system: "http://snomed.info/sct", code: "363346000", display: "Malignant neoplastic disease (disorder)" }],
      text: "Cancer",
    },
    subject: { reference: `Patient/${patient.id}` },
    onsetDateTime: "2025-01-15",
  });

  await upsert({
    resourceType: "Observation",
    id: "obs-000001",
    status: "final",
    code: { text: "sin observación" },
    subject: { reference: `Patient/${patient.id}` },
    effectiveDateTime: "2025-02-01",
    valueQuantity: { value: 1, unit: "arb", system: "http://unitsofmeasure.org", code: "1" },
    derivedFrom: [{ reference: `Condition/${condition.id}` }],
  });

  console.log("Seed - inserted");
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API OK", time: now() });
});

// ------- FHIR endpoints -------

// READ
app.get("/fhir/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  if (!ALLOWED_TYPES.has(type)) return res.status(404).json(outcome(404, "Tipo no soportado"));

  const resource = await readOne(type, id);
  if (!resource) return res.status(404).json(outcome(404, "Recurso no encontrado"));

  res.json(resource);
});

// SEARCH
app.get("/fhir/Patient", async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const nameQ = (req.query.name || "").toString().toLowerCase();
  const identifierQ = (req.query.identifier || "").toString();

  let results = await listByType("Patient");

  // filtro en memoria
  if (nameQ) {
    results = results.filter((p) =>
      (p.name || []).some((n) =>
        `${(n.given || []).join(" ")} ${n.family || ""}`.toLowerCase().includes(nameQ)
      )
    );
  }

  if (identifierQ.includes("|")) {
    const [system, value] = identifierQ.split("|");
    results = results.filter((p) =>
      (p.identifier || []).some((id) => id.system === system && id.value === value)
    );
  }

  res.json(asBundle(results, baseUrl));
});

// SEARCH
app.get("/fhir/Condition", async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const patientParam = (req.query.patient || "").toString();
  const patientId = patientParam.startsWith("Patient/") ? patientParam.split("/")[1] : patientParam;

  let results = await listByType("Condition");

  if (patientId) {
    results = results.filter((c) => c.subject?.reference === `Patient/${patientId}`);
  }

  res.json(asBundle(results, baseUrl));
});

// CREATE: POST /fhir/:type (body = recurso FHIR)
app.post("/fhir/:type", async (req, res) => {
  const { type } = req.params;
  if (!ALLOWED_TYPES.has(type)) {
    return res.status(404).json(outcome(404, "Tipo no soportado"));
  }

  const resource = req.body;

  if (!resource || typeof resource !== "object") {
    return res
      .status(400)
      .json(outcome(400, "Body vacío o inválido. Verifica Content-Type y JSON enviado."));
  }

  if (resource.resourceType !== type) {
    return res
      .status(400)
      .json(outcome(400, `resourceType debe ser '${type}'`));
  }

  try {
    const saved = await upsert(resource);
    res
      .status(201)
      .set("Location", `/fhir/${saved.resourceType}/${saved.id}`)
      .json(saved);
  } catch (e) {
    res.status(400).json(outcome(400, e.message));
  }
});

connectDB()
  .then(seedIfEmpty)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API en http://localhost:${PORT}/api/health`);
      console.log(`FHIR base: http://localhost:${PORT}/fhir/Patient`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a Mongo:", err.message);
    process.exit(1);
  });