const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const authRequired = require("../models/middleware/auth");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

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
    isEmailVerified: user.isEmailVerified,
  };
}

function makeVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashVerificationToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function sendVerificationEmail(user, plainToken) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(
    plainToken
  )}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #222;">
      <h2>Verifica tu correo en OncoConnect</h2>
      <p>Hola ${user.fullName || "usuaria"},</p>
      <p>Gracias por registrarte. Para activar tu cuenta, confirma tu correo haciendo clic en este botón:</p>
      <p>
        <a
          href="${verifyUrl}"
          style="display:inline-block;padding:12px 18px;background:#e1006a;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;"
        >
          Verificar correo
        </a>
      </p>
      <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p>${verifyUrl}</p>
      <p>Este enlace vence en 24 horas.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Verifica tu correo en OncoConnect",
    html,
  });
}

async function issueVerification(user) {
  const plainToken = makeVerificationToken();

  user.emailVerificationTokenHash = hashVerificationToken(plainToken);
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save();
  await sendVerificationEmail(user, plainToken);
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
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    let user = await User.findOne({ email });
    const passwordHash = await bcrypt.hash(password, 10);

    if (user && user.providers.includes("local") && user.isEmailVerified) {
      return res
        .status(409)
        .json({ message: "Ya existe una cuenta verificada con ese correo." });
    }

    if (!user) {
      user = await User.create({
        fullName,
        email,
        passwordHash,
        providers: ["local"],
        isEmailVerified: false,
      });

      await issueVerification(user);

      return res.status(201).json({
        message: "Te enviamos un correo de verificación.",
        email: user.email,
        requiresEmailVerification: true,
      });
    }

    user.fullName = fullName || user.fullName;
    user.passwordHash = passwordHash;

    if (!user.providers.includes("local")) {
      user.providers.push("local");
    }

    // Si ya estaba verificada por Google, no hace falta nuevo correo
    if (user.isEmailVerified) {
      await user.save();

      return res.status(200).json({
        message: "Cuenta local creada. Ya puedes iniciar sesión.",
        email: user.email,
        requiresEmailVerification: false,
      });
    }

    await user.save();
    await issueVerification(user);

    return res.status(200).json({
      message: "Tu cuenta estaba pendiente. Te reenviamos el correo de verificación.",
      email: user.email,
      requiresEmailVerification: true,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Error creando la cuenta." });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const token = String(req.body.token || "");

    if (!token) {
      return res.status(400).json({ message: "Token de verificación faltante." });
    }

    const tokenHash = hashVerificationToken(token);

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "El enlace es inválido o ya venció.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.json({ message: "Correo verificado correctamente. Ya puedes iniciar sesión." });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    res.status(500).json({ message: "Error verificando el correo." });
  }
});

router.post("/resend-verification", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: "Correo requerido." });
    }

    const user = await User.findOne({ email });

    if (!user || !user.providers.includes("local")) {
      return res.status(200).json({
        message: "Si la cuenta existe, revisa tu correo.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        message: "La cuenta ya está verificada. Ya puedes iniciar sesión.",
      });
    }

    await issueVerification(user);

    return res.status(200).json({
      message: "Te reenviamos el correo de verificación.",
    });
  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);
    res.status(500).json({ message: "No se pudo reenviar el correo." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Completa correo y contraseña." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    if (!user.passwordHash || !user.providers.includes("local")) {
      return res
        .status(400)
        .json({ message: "Esta cuenta no tiene contraseña. Entra con Google." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Debes verificar tu correo antes de iniciar sesión.",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      });
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
        isEmailVerified: true,
      });
    } else {
      user.fullName = user.fullName || fullName;
      user.picture = picture || user.picture;
      user.googleId = googleId;
      user.isEmailVerified = true;
      user.emailVerificationTokenHash = null;
      user.emailVerificationExpires = null;

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
  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(500).json({ message: "Error obteniendo usuario." });
  }
});

module.exports = router;