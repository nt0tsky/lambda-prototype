import { IOnDestroy, IOnInit } from '@lambda/core/iface'
import { HitEvents } from '@lambda/core/events'
import { IHitDTO } from '@lambda/core/models'
import { internet } from 'faker'
import { IServiceCradle } from './iface'

export const createService = ({ eventProducer, sendInterval, logger }: IServiceCradle): IOnInit & IOnDestroy => {
  let heartbeatId: NodeJS.Timeout

  return {
    onInit: async () => {
      await eventProducer.onInit()

      heartbeatId = setTimeout(async function sendMessage() {
        const model: IHitDTO = {
          url: `https://totskii.ru/${internet.domainWord()}`,
          ip: internet.ip(),
          ua: internet.userAgent(),
          date: new Date().toISOString()
        }

        await eventProducer.send<IHitDTO>(HitEvents.HIT_RECEIVED, model)

        logger.info(`Hit has sent: ${JSON.stringify(model)}`)
        heartbeatId = setTimeout(sendMessage, sendInterval)
      }, sendInterval)
    },

    onDestroy: async () => {
      clearTimeout(heartbeatId)
      await eventProducer.onDestroy()
    }
  }
}
