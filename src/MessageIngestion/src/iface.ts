import { EventConsumerHandler, IEventConsumer, IEventProducer } from '@lambda/core/iface'

export interface IServiceCradle {
  serviceName: string
  eventConsumer: IEventConsumer
  eventProducer: IEventProducer
  handler: EventConsumerHandler
}
