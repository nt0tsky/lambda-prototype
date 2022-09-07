import { EventConsumerHandler, IEventProducer } from '@lambda/core/iface'
import { Logger } from '@lambda/core/infra/logger'
import { ICacheManager } from '@lambda/core/services'

export interface IServiceCradle {
  serviceName: string
  redisUrl: string
  eventProducer: IEventProducer
  handler: EventConsumerHandler
  logger: Logger
  cacheManager: ICacheManager
}
