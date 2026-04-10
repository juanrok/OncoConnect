const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const authRequired = require("../models/middleware/auth");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    providers: user.providers,
    picture: user.picture || "",
  };
}

router.post("/register", async (req, res) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Completa todos los campos." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    let user = await User.findOne({ email });

    if (user && user.providers.includes("local")) {
      return res.status(409).json({ message: "Ya existe una cuenta con ese correo." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (user) {
      user.fullName = user.fullName || fullName;
      user.passwordHash = passwordHash;
      if (!user.providers.includes("local")) {
        user.providers.push("local");
      }
      await user.save();
    } else {
      user = await User.create({
        fullName,
        email,
        passwordHash,
        providers: ["local"],
      });
    }

    const token = signToken(user);

    res.status(201).json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Error creando la cuenta." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Completa correo y contraseña." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    if (!user.passwordHash || !user.providers.includes("local")) {
      return res.status(400).json({ message: "Esta cuenta no tiene contraseña. Entra con Google." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = signToken(user);

    res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Error iniciando sesión." });
  }
});

router.post("/google", async (req, res) => {
  try {
    const credential = String(req.body.credential || "");

    if (!credential) {
      return res.status(400).json({ message: "Falta la credencial de Google." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({ message: "Token de Google inválido." });
    }

    const email = normalizeEmail(payload.email);
    const googleId = payload.sub;
    const fullName = payload.name || "Usuario Google";
    const picture = payload.picture || "";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        googleId,
        picture,
        providers: ["google"],
      });
    } else {
      user.fullName = user.fullName || fullName;
      user.picture = picture || user.picture;
      user.googleId = googleId;

      if (!user.providers.includes("google")) {
        user.providers.push("google");
      }

      await user.save();
    }

    const token = signToken(user);

    res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);
    res.status(401).json({ message: "No se pudo validar el inicio con Google." });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({ user: serializeUser(user) });
  } catch {
    res.status(500).json({ message: "Error obteniendo usuario." });
  }
});

module.exports = router;