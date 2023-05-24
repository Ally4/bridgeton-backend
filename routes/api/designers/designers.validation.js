import { Joi } from 'celebrate'

export const validate = Joi.object().keys({
    userId: Joi.string().trim().min(4).max(50).required()
    .messages({
        'string.base': `"user id" should be of type 'text'`,
        'string.empty': `"user Id" is required`,
        'any.required': `user id is required`
    }),
    country: Joi.string().trim().required()
    .messages({
        'string.base': `"Country" should be of type 'text'`,
        'string.empty': `"Country" is required`,
        'any.required': `Country is required`
    }),
    description: Joi.string().trim().required()
    .messages({
        'string.base': `"Description" should be of type 'text'`,
        'string.empty': `"Description" is required`,
        'any.required': `"Description" is required`
    })
})

export const validateParam = Joi.object().keys({
    designerId: Joi.string().trim().required()
})
