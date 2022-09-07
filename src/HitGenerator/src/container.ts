import { createLogger } from '@lambda/core/infra/logger'
import { EventProducerKafka } from '@lambda/core/infra/MQ'
import { asValue, AwilixContainer, createContainer } from 'awilix'
import { IServiceCradle } from './iface'

interface IServiceContainerOptions {
  serviceName: string
  hostname: string
  brokers: string[]
  sendInterval: number
}

export const createServiceContainer = ({
  serviceName,
  brokers,
  hostname,
  sendInterval
}: IServiceContainerOptions): AwilixContainer<IServiceCradle> => {
  const container = createContainer<IServiceCradle>({
    injectionMode: 'PROXY'
  })
  const clientId = `${serviceName}:${hostname}`

  container.register({
    serviceName: asValue(serviceName),
    sendInterval: asValue(sendInterval),
    logger: asValue(createLogger(serviceName))
  })

  container.register({
    eventProducer: asValue(new EventProducerKafka(
      clientId,
      brokers
    ))
  })

  return container
}
