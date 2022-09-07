import { HitEvents } from '@lambda/core/events'
import { IOnDestroy, IOnInit } from '@lambda/core/iface'
import { promises } from 'fs'
import { IServiceCradle } from './iface'

export const createService = ({
  eventConsumer, handler, storageManager
}: IServiceCradle): IOnInit & IOnDestroy =>
  ({
    onInit: async () => {
      const seed = await promises.readFile(`${__dirname}/../seed.sql`, 'utf8')
      const queries = seed.split(';').filter((q) =>
        !!q.trim().length)
      await Promise.all(queries.map((query) =>
        storageManager.query(query)))

      await eventConsumer.onInit()
      await eventConsumer.subscribe(HitEvents.HIT_RECEIVED_BATCH, handler)
      await eventConsumer.run()
    },

    onDestroy: async () => {
      await eventConsumer.onDestroy()
    }
  })
