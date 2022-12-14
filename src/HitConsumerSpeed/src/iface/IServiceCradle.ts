import { EventConsumerHandler, IEventConsumer, IEventProducer } from '@lambda/core/iface'
import { Logger } from '@lambda/core/infra/logger'
import { ICacheManager } from '@lambda/core/services/CacheManager'

export interface IServiceCradle {
  serviceName: string
  redisUrl: string
  eventConsumer: IEventConsumer
  eventProducer: IEventProducer
  handler: EventConsumerHandler
  cacheManager: ICacheManager
  logger: Logger
}
