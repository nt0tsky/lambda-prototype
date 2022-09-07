import { createLogger } from '@lambda/core/infra/logger'
import { HitCacheManager, RedisCacheManager } from '@lambda/core/services'
import {
  createContainer, asValue, AwilixContainer, asClass
} from 'awilix'
import { EventProducerKafka } from '@lambda/core/infra/MQ'
import { IServiceCradle } from './iface'

interface IServiceContainerOptions {
  port: number
  nodeId: number
  redisUrl: string
  serviceName: string
  brokers: string[]
}

export const createServiceContainer = ({
  serviceName,
  nodeId,
  brokers,
  redisUrl
}: IServiceContainerOptions): AwilixContainer<IServiceCradle> => {
  const container = createContainer<IServiceCradle>({
    injectionMode: 'PROXY'
  })
  const clientId = `${serviceName}:${nodeId}`

  container.register({
    serviceName: asValue(serviceName),
    redisUrl: asValue(redisUrl),
    eventProducer: asValue(new EventProducerKafka(
      clientId,
      brokers
    )),
    logger: asValue(createLogger(serviceName)),
    cacheManager: asClass(RedisCacheManager).inject(() =>
      ({
        redisUrl
      })).classic().singleton()
  })

  return container
}
