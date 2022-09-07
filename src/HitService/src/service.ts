import { IOnDestroy, IOnInit } from '@lambda/core/iface'
import { IServiceCradle } from './iface'

export const createService = ({
  eventProducer
}: IServiceCradle): IOnInit & IOnDestroy =>
  ({
    onInit: async () => {
      await eventProducer.onInit()
    },

    onDestroy: async () => {
      await eventProducer.onDestroy()
    }
  })
