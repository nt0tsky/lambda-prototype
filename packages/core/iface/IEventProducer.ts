import { IOnDestroy } from './IOnDestroy'
import { IOnInit } from './IOnInit'

export interface IEventProducer extends IOnInit, IOnDestroy {
  send<T = unknown>(topic: string, message: T, ack?: boolean, key?: string): Promise<void>
}
