import { IEventProducer } from '@lambda/core/iface'

export interface IServiceCradle {
  serviceName: string
  sendInterval: number
  eventProducer: IEventProducer
}
