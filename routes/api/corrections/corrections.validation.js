import { Joi } from 'celebrate'

export const validate = Joi.object().keys({
    name: Joi.string().trim().required()
    .messages({
        'string.base': `"name" should be of type 'text'`,
        'string.empty': `"name" is required`,
        'any.required': `name is required`
    }),
    description: Joi.string().trim().required()
    .messages({
        'string.base': `"description" should be of type 'text'`,
        'string.empty': `"description" is required`,
        'any.required': `description is required`
    }),
    image: Joi.string().trim()
    .messages({
        'string.base': `"image is required" should be of type 'text'`,
        'string.empty': `"image is required" is required`,
    }),
})

export const validateParam = Joi.object().keys({
    correctionId: Joi.string().trim().required()
})

export const validateProductId = Joi.object().keys({
    product: Joi.string().trim().required()
})