import { createLogger } from '@lambda/core/infra/logger'
import { EventProducerKafka } from '@lambda/core/infra/MQ'
import { asValue, AwilixContainer, createContainer } from 'awilix'
import { IServiceCradle } from './iface'

interface IServiceContainerOptions {
  serviceName: string
  nodeId: number
  brokers: string[]
  sendInterval: number
}

export const createServiceContainer = ({
  serviceName,
  brokers,
  nodeId,
  sendInterval
}: IServiceContainerOptions): AwilixContainer<IServiceCradle> => {
  const container = createContainer<IServiceCradle>({
    injectionMode: 'PROXY'
  })
  const clientId = `${serviceName}:${nodeId}`

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
