import {
  Kafka, Producer, CompressionTypes, Partitioners
} from 'kafkajs'
import { IEventProducer } from '../../../iface'

export class EventProducerKafka implements IEventProducer {
  private readonly producer: Producer

  constructor(readonly clientId: string, readonly brokers: string[]) {
    const kafka = new Kafka({
      clientId,
      brokers
    })

    this.producer = kafka.producer({
      maxInFlightRequests: 10,
      createPartitioner: Partitioners.LegacyPartitioner
    })
  }

  onDestroy = async (): Promise<void> => {
    if (!this.producer) throw new Error('producer is not defined')

    await this.producer.disconnect()
  }

  onInit = async (): Promise<void> => {
    await this.producer.connect()
  }

  send = async <
    T = Record<string, unknown>
    >(topic: string, message: T, ack?: boolean, key?: string) => {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message), key }],
      compression: CompressionTypes.GZIP,
      acks: ack ? -1 : 0
    })
  }
}
