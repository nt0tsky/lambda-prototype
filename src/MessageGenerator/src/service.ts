import { randomUUID } from 'crypto'
import { IOnDestroy, IOnInit } from '@lambda/core/iface'
import { MessageTopics, MessageEventDTO } from '@lambda/core/events'
import { random } from 'faker'
import { IServiceCradle } from './iface'

export const createService = ({ eventProducer, sendInterval }: IServiceCradle): IOnInit & IOnDestroy => {
  let heartbeatId: NodeJS.Timeout

  return {
    onInit: async () => {
      await eventProducer.onInit()

      heartbeatId = setTimeout(async function sendMessage() {
        await eventProducer.send<any>(
          MessageTopics.MESSAGE_INGESTION,
          {
            message: random.words(10),
            date: new Date().toString(),
            authorId: randomUUID()
          }
        )

        heartbeatId = setTimeout(sendMessage, sendInterval)
      }, sendInterval)
    },

    onDestroy: async () => {
      clearTimeout(heartbeatId)
      await eventProducer.onDestroy()
    }
  }
}
