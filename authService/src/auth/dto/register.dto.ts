import * as Joi from 'joi'

export const RegisterSchema = Joi.object({
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string()
  .min(8).required().messages({
    'string.min': 'password must be at least 8 characters long',
    'any.required': 'password is required'
  })
  .pattern(new RegExp('[a-z]')).messages({
    'string.pattern.base': 'password must contain at least one lowercase letter'
  })
  .pattern(new RegExp('[A-Z]')).messages({
    'string.pattern.base': 'password must contain at least one uppercase letter'
  })
  .pattern(new RegExp('[0-9]')).messages({
    'string.pattern.base': 'password must contain at least one number'
  })
  .pattern(new RegExp('[!@#$%^&*(),.?":{}|<>]')).messages({
    'string.pattern.base': 'password must contain at least one special character'
  })
})