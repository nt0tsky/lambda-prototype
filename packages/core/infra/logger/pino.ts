import pino, { Logger } from 'pino'

const createLogger = (serviceName: string): Logger =>
  pino({
    name: serviceName,
    transport: {
      target: 'pino-pretty'
    }
  })

export { createLogger, Logger }
