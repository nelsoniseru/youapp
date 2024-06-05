
  

  import * as Joi from 'joi'

export const chatSchema = Joi.object({
  content: Joi.string().required(),
  chatId: Joi.string().required(),
})