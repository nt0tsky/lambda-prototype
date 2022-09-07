import { IHitDTO } from '@lambda/core/models'
import { EventConsumerHandler } from '@lambda/core/iface'
import { IServiceCradle } from '../../iface'

export const createHandler = ({
  logger, storageManager, cacheManager
}: IServiceCradle): EventConsumerHandler<IHitDTO> => {
  const updateView = async () => {
    // get stats for last 7 days to update
    const date = new Date()
    date.setDate(date.getDate() - 7)

    const metrics = await storageManager.statsByDate({
      dateStart: date.toISOString()
    })

    // update metrics from batch with deep analyze ?
    await Promise.all(metrics.map(async ({ count, date }) => {
      await cacheManager.add(date, count)
    }))
  }

  return async (data: IHitDTO) => {
    logger.info(`Handle: ${JSON.stringify(data)}`)

    await storageManager.addHit(data)

    await updateView()
  }
}
