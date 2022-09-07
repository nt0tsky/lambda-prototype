import { createLogger } from '@lambda/core/infra/logger'
import { HitCacheManager, RedisCacheManager } from '@lambda/core/services'
import {
  createContainer, asValue, AwilixContainer, asClass
} from 'awilix'
import { EventProducerKafka } from '@lambda/core/infra/MQ'
import { IServiceCradle } from './iface'

interface IServiceContainerOptions {
  port: number
  hostname: string
  redisUrl: string
  serviceName: string
  brokers: string[]
}

export const createServiceContainer = ({
  serviceName,
  hostname,
  brokers,
  redisUrl
}: IServiceContainerOptions): AwilixContainer<IServiceCradle> => {
  const container = createContainer<IServiceCradle>({
    injectionMode: 'PROXY'
  })
  const clientId = `${serviceName}:${hostname}`

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
