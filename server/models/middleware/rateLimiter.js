const rateLimit = require("express-rate-limit");

// Rate limiter para rutas de autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP en 15 minutos
  message: "Demasiados intentos. Intenta de nuevo en 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // No aplica rate limit a localhost en desarrollo
    return req.ip === "::1" || req.ip === "127.0.0.1";
  },
});

// Rate limiter más estricto para verificación de correo
const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 intentos por hora
  message: "Demasiados intentos de verificación. Intenta de nuevo más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.ip === "::1" || req.ip === "127.0.0.1";
  },
});

module.exports = {
  authLimiter,
  verificationLimiter,
};
