const crypto = require("crypto");
const FhirResource = require("../../models/FhirResource");
const User = require("../../models/User");

const ID_PREFIX = {
  Patient: "pt",
};

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

async function createPatientForUser(user) {
  try {
    const patientId = await nextSequentialId("Patient");

    const patientResource = {
      resourceType: "Patient",
      id: patientId,
      meta: {
        profile: [
          "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-patient",
        ],
        lastUpdated: new Date().toISOString(),
      },
      identifier: [
        {
          system: "http://example.org/mrn",
          value: user._id.toString(),
        },
      ],
      name: [
        {
          use: "official",
          given: [user.fullName.split(" ")[0] || "Usuario"],
          family: user.fullName.split(" ").slice(1).join(" ") || "Paciente",
        },
      ],
      telecom: [
        {
          system: "email",
          value: user.email,
        },
      ],
      gender: "unknown",
      birthDate: "1900-01-01",
    };

    const fhirDoc = await FhirResource.findOneAndUpdate(
      { resourceType: "Patient", resourceId: patientId },
      {
        resourceType: "Patient",
        resourceId: patientId,
        resource: patientResource,
      },
      { upsert: true, new: true }
    );

    return patientId;
  } catch (error) {
    console.error("ERROR creando Patient FHIR:", error);
    throw error;
  }
}

async function getPatientForUser(userId) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.patientResourceId) return null;

    const doc = await FhirResource.findOne({
      resourceType: "Patient",
      resourceId: user.patientResourceId,
    }).lean();

    return doc?.resource || null;
  } catch (error) {
    console.error("ERROR obteniendo Patient FHIR:", error);
    return null;
  }
}

module.exports = {
  createPatientForUser,
  getPatientForUser,
  nextSequentialId,
};
