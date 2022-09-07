import { createLogger } from '@lambda/core/infra/logger'
import { RedisCacheManager } from '@lambda/core/services'
import {
  createContainer, asValue, AwilixContainer, asClass, asFunction
} from 'awilix'
import { EventProducerKafka, EventConsumerKafka } from '@lambda/core/infra/MQ'
import { IServiceCradle } from './iface'
import { createHandler } from './infra/handler'

interface IServiceContainerOptions {
  serviceName: string
  hostname: string
  brokers: string[]
  redisUrl: string
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
    eventConsumer: asValue(new EventConsumerKafka(
      clientId,
      serviceName,
      brokers
    )),
    logger: asValue(createLogger(serviceName))
  })

  container.register({
    handler: asFunction(createHandler),
    cacheManager: asClass(RedisCacheManager).inject(() =>
      ({
        redisUrl
      })).classic().singleton()
  })

  return container
}
