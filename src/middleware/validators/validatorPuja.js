import Joi from "joi";

const pujaSchema = Joi.object().keys({

    valor: Joi.number().required().messages({
        'number.base': 'El "valor de la puja" debe ser de tipo numérico',
        'number.empty': 'El "valor de la puja" es obligatorio',
        'any.required': 'El "valor de la puja" es obligatorio',
    }),
    fecha_puja: Joi.date().messages({
        'date.base': 'La "fecha de la puja" debe ser de tipo fecha',
        'date.empty': 'La "fecha de la puja" es obligatorio',
        'any.required': 'La "fecha de la puja" es obligatorio',
    })
});

export const validatorPuja = async (req, res, next) => {
    try {
        await pujaSchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        res.json({
            error: error.message
        });
    }
};
