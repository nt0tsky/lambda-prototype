import { Express } from 'express'
import { mw } from 'request-ip'
import { IServiceCradle } from '../iface'
import { HitsController } from './controllers/HitsController'
import { createErrorHandler } from './ErrorHandler'

export const createRoutes = (
  app: Express,
  cradle: IServiceCradle
): void => {
  const hitsController = new HitsController(cradle)

  app.use(mw())
  app.get('/hit', hitsController.addHit)
  app.get('/stats', hitsController.getHitStats)

  app.use(createErrorHandler(cradle))
}
