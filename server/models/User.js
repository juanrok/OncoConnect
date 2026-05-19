const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    providers: {
      type: [
        {
          type: String,
          enum: ["local", "google"],
        },
      ],
      default: [],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    picture: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    patientResourceId: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);