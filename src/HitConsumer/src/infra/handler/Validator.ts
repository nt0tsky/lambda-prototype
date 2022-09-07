import Validator, { ValidationRule } from 'fastest-validator'

const v = new Validator()

const schema: Record<string, ValidationRule | boolean> = {
  url: { type: 'string' },
  ip: { type: 'string' },
  ua: { type: 'string' },
  date: { type: 'string' },
  $$strict: true
}

const HitValidator = v.compile(schema)

export { HitValidator }
