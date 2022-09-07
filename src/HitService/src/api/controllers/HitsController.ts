import { HitEvents } from '@lambda/core/events'
import { Logger } from '@lambda/core/infra/logger'
import { IEventProducer } from '@lambda/core/iface'
import { ICounterView, IHitDTO } from '@lambda/core/models'
import { ICacheManager } from '@lambda/core/services'
import { NextFunction } from 'express'
import { IServiceCradle } from '../../iface'
import {
  BaseController, TRequestQuery, TResponse
} from './BaseController'

export class HitsController extends BaseController {
  private readonly eventProducer: IEventProducer

  private readonly cacheManager: ICacheManager

  private readonly logger: Logger

  constructor({ cacheManager, eventProducer, logger }: IServiceCradle) {
    super()
    this.eventProducer = eventProducer
    this.cacheManager = cacheManager
    this.logger = logger
  }

  public getHitStats = async (
    req: TRequestQuery<{ date: string }>,
    res: TResponse<{ date: string; total: number }>,
    next: NextFunction
  ): Promise<TResponse<{ date: string; total: number }>> =>
    this.wrap(async () => {
      if (!req.query.date) throw new Error('date is required in format YYYY-MM-DD')

      const date = String(+new Date(req.query.date))
      const view = await this.cacheManager.get<ICounterView>(date)

      return res.json({ date, total: view?.total ?? 0 })
    }, next)

  public addHit = async (
    req: TRequestQuery<{ url: string }>,
    res: TResponse<void>,
    next: NextFunction
  ): Promise<TResponse<void>> =>
    this.wrap(async () => {
      if (!req.query.url) throw new Error('url is required')

      const model = {
        url: req.query.url,
        ip: req.clientIp || '',
        ua: req.get('User-Agent') as string,
        date: new Date().toISOString()
      }

      this.logger.info(`Handle: ${JSON.stringify(model)}`)

      await this.eventProducer.send<IHitDTO>(HitEvents.HIT_RECEIVED, model)

      return res.status(204).send()
    }, next)
}
