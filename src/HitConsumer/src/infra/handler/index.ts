import { HitEvents } from '@lambda/core/events'
import { EventConsumerHandler } from '@lambda/core/iface'
import { IHitDTO } from '@lambda/core/models'
import { IServiceCradle } from '../../iface'
import { HitValidator } from './Validator'

export const createHandler = ({ eventProducer, logger }: IServiceCradle): EventConsumerHandler<IHitDTO> => {
  const target = [
    HitEvents.HIT_RECEIVED_SPEED,
    HitEvents.HIT_RECEIVED_BATCH
  ]

  return async (data: IHitDTO) => {
    logger.info(`Handle: ${JSON.stringify(data)}`)

    const errors = HitValidator(data)

    if (Array.isArray(errors) && errors.length) {
      logger.error(errors.join(','))

      return
    }

    await Promise.all(target.map(async (event) =>
      eventProducer.send(event, data)))
  }
}
