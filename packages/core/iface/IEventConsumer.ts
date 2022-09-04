import { IOnDestroy } from './IOnDestroy'
import { IOnInit } from './IOnInit'

export type EventConsumerHandler<T = any> = (data: T) => Promise<void>

export interface IEventConsumer extends IOnInit, IOnDestroy {
  subscribe: (topic: string, handler: EventConsumerHandler) => Promise<void>
  run: () => Promise<void>
}
