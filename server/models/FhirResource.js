const mongoose = require("mongoose");

const FhirResourceSchema = new mongoose.Schema(
  {
    resourceType: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    resource: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

FhirResourceSchema.index({ resourceType: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model("FhirResource", FhirResourceSchema);