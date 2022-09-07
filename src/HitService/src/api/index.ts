import express, { Express } from 'express'
import { IServiceCradle } from '../iface'
import { createRoutes } from './routes'

export const createExpressServer = (cradle: IServiceCradle): Express => {
  const app = express()

  app.use(express.json({ strict: true }))
  createRoutes(app, cradle)

  return app
}

export { Express }
