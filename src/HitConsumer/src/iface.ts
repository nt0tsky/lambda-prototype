import { EventConsumerHandler, IEventConsumer, IEventProducer } from '@lambda/core/iface'
import { Logger } from '@lambda/core/infra/logger'

export interface IServiceCradle {
  serviceName: string
  eventConsumer: IEventConsumer
  eventProducer: IEventProducer
  handler: EventConsumerHandler
  logger: Logger
}
