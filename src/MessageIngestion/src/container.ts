import {
  createContainer, asValue, AwilixContainer, asFunction
} from 'awilix'
import { EventProducerKafka, EventConsumerKafka } from '@lambda/core/infra/MQ'
import { createHandler } from './handler'
import { IServiceCradle } from './iface'

interface IServiceContainerOptions {
  serviceName: string
  nodeId: number
  brokers: string[]
}

export const createServiceContainer = ({
  serviceName,
  nodeId,
  brokers
}: IServiceContainerOptions): AwilixContainer<IServiceCradle> => {
  const container = createContainer<IServiceCradle>({
    injectionMode: 'PROXY'
  })
  const clientId = `${serviceName}:${nodeId}:hui`

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
    ))
  })

  container.register({
    handler: asFunction(createHandler)
  })

  return container
}
