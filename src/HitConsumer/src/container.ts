import { createLogger } from '@lambda/core/infra/logger'
import {
  createContainer, asValue, AwilixContainer, asFunction
} from 'awilix'
import { EventProducerKafka, EventConsumerKafka } from '@lambda/core/infra/MQ'
import { createHandler } from './infra/handler'
import { IServiceCradle } from './iface'

interface IServiceContainerOptions {
  serviceName: string
  hostname: string
  brokers: string[]
}

export const createServiceContainer = ({
  serviceName,
  hostname,
  brokers
}: IServiceContainerOptions): AwilixContainer<IServiceCradle> => {
  const container = createContainer<IServiceCradle>({
    injectionMode: 'PROXY'
  })
  const clientId = `${serviceName}:${hostname}`

  container.register({
    serviceName: asValue(serviceName),
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
    handler: asFunction(createHandler)
  })

  return container
}
