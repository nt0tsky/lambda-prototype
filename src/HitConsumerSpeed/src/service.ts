import { HitEvents } from '@lambda/core/events'
import { IOnDestroy, IOnInit } from '@lambda/core/iface'
import { IServiceCradle } from './iface'

export const createService = ({ eventConsumer, handler }: IServiceCradle): IOnInit & IOnDestroy =>
  ({
    onInit: async () => {
      await eventConsumer.onInit()
      await eventConsumer.subscribe(HitEvents.HIT_RECEIVED_SPEED, handler)
      await eventConsumer.run()
    },

    onDestroy: async () => {
      await eventConsumer.onDestroy()
    }
  })
