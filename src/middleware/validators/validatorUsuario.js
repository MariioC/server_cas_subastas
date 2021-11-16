import Joi from "joi";

const usuarioSchema = Joi.object().keys({
    nombre: Joi.string().trim().required().messages({
        "string.base": "El campo nombre debe ser de tipo texto",
        "string.empty": "El campo nombre es obligatorio",
        "any.required": "El campo nombre es obligatorio",
    }),
    correo: Joi.string().trim().email().required().messages({
        "string.base": "El campo correo debe ser de tipo texto",
        "string.empty": "El campo correo es obligatorio",
        "string.email": "El correo ingresado no es válido",
        "any.required": "El campo correo es obligatorio",
    }),
    tipo_documento: Joi.string().trim().required().messages({
        "string.base": "El campo tipo de documento debe ser de tipo texto",
        "any.empty": "El campo tipo de documento es obligatorio",
        "any.required": "El campo tipo de documento es obligatorio",
    }),
    documento: Joi.number().required().messages({
        "number.base": "El campo documento debe ser numérico",
        "any.required": "El campo documento es obligatorio",
    }),
    fecha_nacimiento: Joi.date().required().messages({
        "date.base": "El campo fecha de nacimiento no tiene un formato de fecha válido",
        "any.required": "El campo fecha de nacimiento es obligatorio",
    }),
    expedicion_documento: Joi.date().required().messages({
        "date.base": "El campo fecha de expedición no tiene un formato de fecha válido",
        "any.required": "El campo fecha de expedición es obligatorio",
    }),
    password: Joi.string().trim().min(8).required().messages({
        "string.base": "El campo contraseña debe ser de tipo alfanumérico",
        "string.min": "El campo contraseña debe terner mínimo 8 caracteres",
        "any.empty": "El campo contraseña es obligatorio",
        "any.required": "El campo contraseña es obligatorio",
    }),
    re_password: Joi.any().valid(Joi.ref("password")).required().messages({
        "any.only": "Las contraseñas no coinciden",
    }),
    tipo_usuario: Joi.string(),
});

const loginSchema = Joi.object().keys({
    documento: Joi.number().required().messages({
        "number.base": "El campo documento debe ser numérico",
        "any.required": "El campo documento es obligatorio",
    }),
    password: Joi.string().trim().required().messages({
        "string.base": "El campo contraseña debe ser de tipo alfanumérico",
        "any.empty": "El campo contraseña es obligatorio",
        "any.required": "El campo contraseña es obligatorio",
    }),
});

export const validatorUsuario = async (req, res, next) => {
    try {
        await usuarioSchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        res.json({
            error: error.message,
        });
    }
};

export const validatorLogin = async (req, res, next) => {
    try {
        await loginSchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        res.json({
            error: error.message,
        });
    }
};
