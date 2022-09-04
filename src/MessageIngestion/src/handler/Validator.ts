import Validator, { ValidationRule, ValidationSchema } from 'fastest-validator'

const v = new Validator()

const schema: ValidationSchema = {
  message: { type: 'string' } as ValidationRule,
  date: { type: 'string' } as ValidationRule,
  authorId: { type: 'uuid' } as ValidationRule,
  $$strict: true
}

const MessageValidator = v.compile(schema)

export { MessageValidator }
