import { createLogger } from '@lambda/core/infra/logger'
import { RedisCacheManager } from '@lambda/core/services/CacheManager'
import {
  createContainer, asValue, AwilixContainer, asFunction, asClass
} from 'awilix'
import { EventProducerKafka, EventConsumerKafka } from '@lambda/core/infra/MQ'
import { ClickHouseManager } from './infra/ClickHouseManager'
import { createHandler } from './infra/handler'
import { IServiceCradle } from './iface'

interface IServiceContainerOptions {
  serviceName: string
  clickhouseUrl: string
  redisUrl: string
  nodeId: number
  brokers: string[]
}

export const createServiceContainer = ({
  serviceName,
  nodeId,
  brokers,
  clickhouseUrl,
  redisUrl
}: IServiceContainerOptions): AwilixContainer<IServiceCradle> => {
  const container = createContainer<IServiceCradle>({
    injectionMode: 'PROXY'
  })
  const clientId = `${serviceName}:${nodeId}`

  container.register({
    serviceName: asValue(serviceName),
    clickhouseUrl: asValue(clickhouseUrl),
    redisUrl: asValue(redisUrl),
    eventProducer: asValue(new EventProducerKafka(
      clientId,
      brokers
    )),
    eventConsumer: asValue(new EventConsumerKafka(
      clientId,
      serviceName,
      brokers
    ))
  })

  container.register({
    logger: asValue(createLogger(serviceName)),
    handler: asFunction(createHandler),
    storageManager: asClass(ClickHouseManager).singleton(),
    cacheManager: asClass(RedisCacheManager).inject(() =>
      ({
        redisUrl
      })).classic().singleton()
  })

  return container
}
