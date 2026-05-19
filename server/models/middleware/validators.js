const Joi = require("joi");

// Esquemas de validación
const schemas = {
  register: Joi.object({
    fullName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty": "El nombre completo no puede estar vacío.",
        "string.min": "El nombre debe tener al menos 2 caracteres.",
        "string.max": "El nombre no puede exceder 100 caracteres.",
        "any.required": "El nombre es requerido.",
      }),
    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required()
      .messages({
        "string.email": "El correo debe ser válido.",
        "any.required": "El correo es requerido.",
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.min": "La contraseña debe tener al menos 6 caracteres.",
        "any.required": "La contraseña es requerida.",
      }),
  }),

  login: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required()
      .messages({
        "string.email": "El correo debe ser válido.",
        "any.required": "El correo es requerido.",
      }),
    password: Joi.string()
      .required()
      .messages({
        "any.required": "La contraseña es requerida.",
      }),
  }),

  googleAuth: Joi.object({
    credential: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": "La credencial de Google es requerida.",
      }),
  }),

  verifyEmail: Joi.object({
    token: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": "El token de verificación es requerido.",
      }),
  }),

  resendVerification: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required()
      .messages({
        "string.email": "El correo debe ser válido.",
        "any.required": "El correo es requerido.",
      }),
  }),

  createMedication: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        "string.empty": "El nombre del medicamento no puede estar vacío.",
        "any.required": "El nombre del medicamento es requerido.",
      }),
    dose: Joi.string()
      .trim()
      .max(50)
      .optional()
      .allow("")
      .messages({
        "string.max": "La dosis no puede exceder 50 caracteres.",
      }),
    frequency: Joi.string()
      .trim()
      .max(100)
      .optional()
      .allow("")
      .messages({
        "string.max": "La frecuencia no puede exceder 100 caracteres.",
      }),
    notes: Joi.string()
      .trim()
      .max(500)
      .optional()
      .allow("")
      .messages({
        "string.max": "Las notas no pueden exceder 500 caracteres.",
      }),
    startDate: Joi.date()
      .optional()
      .messages({
        "date.base": "La fecha de inicio debe ser válida.",
      }),
    endDate: Joi.date()
      .optional()
      .allow(null)
      .messages({
        "date.base": "La fecha de fin debe ser válida.",
      }),
  }),

  updateMedication: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        "string.empty": "El nombre del medicamento no puede estar vacío.",
      }),
    dose: Joi.string()
      .trim()
      .max(50)
      .optional()
      .allow("")
      .messages({
        "string.max": "La dosis no puede exceder 50 caracteres.",
      }),
    frequency: Joi.string()
      .trim()
      .max(100)
      .optional()
      .allow("")
      .messages({
        "string.max": "La frecuencia no puede exceder 100 caracteres.",
      }),
    notes: Joi.string()
      .trim()
      .max(500)
      .optional()
      .allow("")
      .messages({
        "string.max": "Las notas no pueden exceder 500 caracteres.",
      }),
    startDate: Joi.date()
      .optional()
      .messages({
        "date.base": "La fecha de inicio debe ser válida.",
      }),
    endDate: Joi.date()
      .optional()
      .allow(null)
      .messages({
        "date.base": "La fecha de fin debe ser válida.",
      }),
  }),
};

// Middleware de validación
function validate(schemaKey) {
  return (req, res, next) => {
    const schema = schemas[schemaKey];
    if (!schema) {
      return res.status(500).json({ message: "Schema de validación no encontrado." });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validación fallida.",
        errors: messages,
      });
    }

    req.body = value;
    next();
  };
}

module.exports = {
  schemas,
  validate,
};
