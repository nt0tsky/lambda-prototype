import { IHitDTO } from '@lambda/core/models'
import { EventConsumerHandler } from '@lambda/core/iface'
import { IServiceCradle } from '../../iface'

export const createHandler = ({ logger, cacheManager }: IServiceCradle): EventConsumerHandler<IHitDTO> => {
  const increaseViewCounter = async (model: IHitDTO): Promise<void> => {
    const key = new Date(model.date).toISOString().split('T')[0]

    const response = await cacheManager.get<number>(key)

    await cacheManager.add<number>(key, response ? +response + 1 : 1)
  }

  return async (data: IHitDTO) => {
    logger.info(`Handle: ${JSON.stringify(data)}`)

    await Promise.all([
      increaseViewCounter(data)
      // other metrics
    ])
  }
}
