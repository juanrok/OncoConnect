const express = require("express");
const authRequired = require("../models/middleware/auth");
const { validate } = require("../models/middleware/validators");
const Medication = require("../models/Medication");

const router = express.Router();

// GET /api/medications - obtener medicamentos del usuario autenticado
router.get("/", authRequired, async (req, res) => {
  try {
    const userId = req.auth.sub;
    const medications = await Medication.find({ userId }).sort({ createdAt: -1 });
    res.json(medications);
  } catch (error) {
    console.error("GET MEDICATIONS ERROR:", error);
    res.status(500).json({ message: "Error obteniendo medicamentos." });
  }
});

// GET /api/medications/:id - obtener un medicamento específico
router.get("/:id", authRequired, async (req, res) => {
  try {
    const userId = req.auth.sub;
    const { id } = req.params;

    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    // Validar ownership
    if (medication.userId.toString() !== userId) {
      return res.status(403).json({ message: "No tienes acceso a este medicamento." });
    }

    res.json(medication);
  } catch (error) {
    console.error("GET MEDICATION ERROR:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID de medicamento inválido." });
    }
    res.status(500).json({ message: "Error obteniendo medicamento." });
  }
});

// POST /api/medications - crear medicamento
router.post("/", authRequired, validate("createMedication"), async (req, res) => {
  try {
    const userId = req.auth.sub;
    const { name, dose, frequency, notes, startDate, endDate, patientResourceId } = req.body;

    const medication = await Medication.create({
      userId,
      patientResourceId: patientResourceId || null,
      name,
      dose: dose || "",
      frequency: frequency || "",
      notes: notes || "",
      startDate: startDate || new Date(),
      endDate: endDate || null,
    });

    res.status(201).json(medication);
  } catch (error) {
    console.error("CREATE MEDICATION ERROR:", error);
    res.status(500).json({ message: "Error creando medicamento." });
  }
});

// PUT /api/medications/:id - actualizar medicamento
router.put("/:id", authRequired, validate("updateMedication"), async (req, res) => {
  try {
    const userId = req.auth.sub;
    const { id } = req.params;
    const { name, dose, frequency, notes, startDate, endDate, patientResourceId } = req.body;

    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    // Validar ownership
    if (medication.userId.toString() !== userId) {
      return res.status(403).json({ message: "No tienes acceso a este medicamento." });
    }

    // Actualizar solo los campos que se envíen
    if (name !== undefined) medication.name = name;
    if (dose !== undefined) medication.dose = dose;
    if (frequency !== undefined) medication.frequency = frequency;
    if (notes !== undefined) medication.notes = notes;
    if (startDate !== undefined) medication.startDate = startDate;
    if (endDate !== undefined) medication.endDate = endDate;
    if (patientResourceId !== undefined) medication.patientResourceId = patientResourceId;

    await medication.save();

    res.json(medication);
  } catch (error) {
    console.error("UPDATE MEDICATION ERROR:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID de medicamento inválido." });
    }
    res.status(500).json({ message: "Error actualizando medicamento." });
  }
});

// DELETE /api/medications/:id - eliminar medicamento
router.delete("/:id", authRequired, async (req, res) => {
  try {
    const userId = req.auth.sub;
    const { id } = req.params;

    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    // Validar ownership
    if (medication.userId.toString() !== userId) {
      return res.status(403).json({ message: "No tienes acceso a este medicamento." });
    }

    await Medication.findByIdAndDelete(id);

    res.json({ message: "Medicamento eliminado." });
  } catch (error) {
    console.error("DELETE MEDICATION ERROR:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID de medicamento inválido." });
    }
    res.status(500).json({ message: "Error eliminando medicamento." });
  }
});

module.exports = router;
