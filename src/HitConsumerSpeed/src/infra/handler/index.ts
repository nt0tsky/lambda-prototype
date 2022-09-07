import { IHitDTO, ICounterView } from '@lambda/core/models'
import { EventConsumerHandler } from '@lambda/core/iface'
import { IServiceCradle } from '../../iface'

export const createHandler = ({ logger, cacheManager }: IServiceCradle): EventConsumerHandler<IHitDTO> => {
  const createCacheKey = (model: IHitDTO): string => {
    const date = new Date(model.date)
    date.setUTCHours(0, 0, 0, 0)

    return String(+date)
  }

  const commitHitCounter = async (key:string): Promise<void> => {
    const response = await cacheManager.get<ICounterView>(key) || { key, total: 0 }
    response.total += 1
    await cacheManager.add<ICounterView>(key, response)
  }

  const increaseViewCounter = async (model: IHitDTO): Promise<void> => {
    const key = createCacheKey(model)

    // sign hit as white
    await cacheManager.add<boolean>(JSON.stringify(model), true)

    await commitHitCounter(key)
  }

  return async (data: IHitDTO) => {
    logger.info(`Handle: ${JSON.stringify(data)}`)

    await Promise.all([
      increaseViewCounter(data)
      // other metrics
    ])
  }
}
