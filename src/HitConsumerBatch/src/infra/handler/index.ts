import { ICounterView, IHitDTO } from '@lambda/core/models'
import { EventConsumerHandler } from '@lambda/core/iface'
import { IServiceCradle } from '../../iface'

export const createHandler = ({
  logger, storageManager, cacheManager
}: IServiceCradle): EventConsumerHandler<IHitDTO> => {
  const isFraudHitLongAnalysis = (data: IHitDTO): Promise<boolean> => {
    const isFraud = (): boolean =>
      (!!Math.floor(Math.random() * 2))

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(isFraud())
      }, 10000)
    })
  }

  const createCacheKey = (model: IHitDTO): string => {
    const date = new Date(model.date)
    date.setUTCHours(0, 0, 0, 0)

    return String(+date)
  }

  const rollbackHitCounter = async (key: string): Promise<void> => {
    const response = await cacheManager.get<ICounterView>(key)
    response!.total -= 1
    await cacheManager.add<ICounterView>(key, response!)
  }

  const analyzeHitAndUpdate = async (model: IHitDTO): Promise<void> => {
    const key = createCacheKey(model)
    const value = await cacheManager.get<IHitDTO>(key)
    const isFraud = await isFraudHitLongAnalysis(model)

    // sign hit as fraud or not
    await cacheManager.add<boolean>(JSON.stringify(model), isFraud)

    if (value && isFraud) await rollbackHitCounter(key)
  }

  return async (data: IHitDTO) => {
    logger.info(`Handle: ${JSON.stringify(data)}`)

    await Promise.all([
      storageManager.addHit(data),
      analyzeHitAndUpdate(data)
    ])
    await storageManager.addHit(data)
  }
}
