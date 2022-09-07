import { HitEvents } from '@lambda/core/events'
import { IOnDestroy, IOnInit } from '@lambda/core/iface'
import { IServiceCradle } from './iface'

export const createService = ({
  eventProducer, eventConsumer, handler
}: IServiceCradle): IOnInit & IOnDestroy =>
  ({
    onInit: async () => {
      await eventConsumer.onInit()
      await eventConsumer.subscribe(HitEvents.HIT_RECEIVED, handler)
      await eventConsumer.run()
      await eventProducer.onInit()
    },

    onDestroy: async () => {
      await eventConsumer.onDestroy()
      await eventProducer.onDestroy()
    }
  })
