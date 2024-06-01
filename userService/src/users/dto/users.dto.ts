import * as Joi from 'joi'

export const ProfileSchema = Joi.object({
  display_name: Joi.string().required(),
  gender: Joi.string().required(),
  birthday: Joi.date(),
  horoscope: Joi.string(),
  zodiac: Joi.string(),
  height: Joi.number(),
  weight: Joi.number(),
})