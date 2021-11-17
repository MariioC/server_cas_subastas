import Joi from "joi";

const subastaSchema = Joi.object().keys({

    nombre: Joi.string().trim().required().messages({
        'string.base': 'El campo "nombre de la subasta" debe ser de tipo texto',
        'string.empty': 'El campo "nombre de la subasta" es obligatorio',
        'any.required': 'El campo "nombre de la subasta" es obligatorio',
    }),
    // foto: Joi.string().trim().required().messages({
    //     'string.base': 'El campo "foto subasta" debe ser de tipo texto',
    //     'string.empty': 'El campo "foto subasta" es obligatorio',
    //     'any.required': 'El campo "foto subasta" es obligatorio',
    // }),
    descripcion: Joi.string().trim().required().messages({
        'string.base': 'El campo "descripción de la subasta" debe ser de tipo texto',
        'string.empty': 'El campo "descripción de la subasta" es obligatorio',
        'any.required': 'El campo "descripción de la subasta" es obligatorio',
    }),
    fecha_cancelacion: Joi.date().required().messages({
        'date.base': 'El campo "fecha límite de cancelación" debe ser de tipo fecha',
        'date.empty': 'El campo "fecha límite de cancelación" es obligatorio',
        'any.required': 'El campo "fecha límite de cancelación" es obligatorio',
    }),
    fecha_inicio: Joi.date().required().messages({
        'date.base': 'El campo "fecha inicio" debe ser de tipo fecha',
        'date.empty': 'El campo "fecha inicio" es obligatorio',
        'any.required': 'El campo "fecha inicio" es obligatorio',
    }),
    hora_inicio: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required().messages({
        'string.base': 'El campo "hora inicio" debe ser de tipo hora',
        'string.pattern.base': 'El campo "hora inicio" no tiene un formato de hora válido',
        'string.empty': 'El campo "hora inicio" es obligatorio',
        'any.required': 'El campo "hora inicio" es obligatorio',
    }),
    fecha_fin: Joi.date().required().messages({
        'date.base': 'El campo "fecha fin" debe ser de tipo fecha',
        'date.empty': 'El campo "fecha fin" es obligatorio',
        'any.required': 'El campo "fecha fin" es obligatorio',
    }),
    hora_fin: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required().messages({
        'string.base': 'El campo "hora fin" debe ser de tipo hora',
        'string.pattern.base': 'El campo "hora fin" no tiene un formato de hora válido',
        'string.empty': 'El campo "hora fin" es obligatorio',
        'any.required': 'El campo "hora fin" es obligatorio',
    }),
    monto_inicial: Joi.number().required().messages({
        'number.base': 'El campo "monto inicial" debe ser de tipo numérico',
        'number.empty': 'El campo "monto inicial" es obligatorio',
        'any.required': 'El campo "monto inicial" es obligatorio',
    }),
    online: Joi.boolean().default(false).messages({
        'boolean.base': 'El campo "online" debe ser de tipo boleano',
        'boolean.empty': 'El campo "online" es obligatorio',
        'any.required': 'El campo "online" es obligatorio',
    })
});

export const validatorSubasta = async (req, res, next) => {
    try {
        await subastaSchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        res.json({
            error: error.message
        });
    }
};
