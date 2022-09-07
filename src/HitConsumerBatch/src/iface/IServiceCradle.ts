import { Logger } from '@lambda/core/infra/logger'
import { EventConsumerHandler, IEventConsumer, IEventProducer } from '@lambda/core/iface'
import { ICacheManager } from '@lambda/core/services/CacheManager'
import { IStorageManager } from './IStorageManager'

export interface IServiceCradle {
  serviceName: string
  clickhouseUrl: string
  redisUrl: string
  logger: Logger
  eventConsumer: IEventConsumer
  eventProducer: IEventProducer
  handler: EventConsumerHandler
  storageManager: IStorageManager
  cacheManager: ICacheManager
}
