import { IOnDestroy, IOnInit } from '@lambda/core/iface'
import { IServiceCradle } from './iface'

export const createService = ({ serviceName, eventConsumer, handler }: IServiceCradle): IOnInit & IOnDestroy =>
  ({
    onInit: async () => {
      await eventConsumer.onInit()
      await eventConsumer.subscribe(serviceName, handler)
      await eventConsumer.run()
    },

    onDestroy: async () => {
      await eventConsumer.onDestroy()
    }
  })
