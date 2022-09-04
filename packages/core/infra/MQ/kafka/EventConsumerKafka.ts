import { Kafka, Consumer } from 'kafkajs'
import { IEventConsumer, EventConsumerHandler } from '../../../iface'

export class EventConsumerKafka implements IEventConsumer {
  private readonly consumer: Consumer

  private readonly handlers: Record<string, EventConsumerHandler> = {}

  constructor(
    readonly clientId: string,
    readonly groupId: string,
    readonly brokers: string[],
    readonly sessionTimeout: number = 30000
  ) {
    const kafka = new Kafka({
      clientId,
      brokers
    })

    this.consumer = kafka.consumer({ groupId, sessionTimeout })
  }

  onDestroy = async (): Promise<void> => {
    await this.consumer.stop()
    await this.consumer.disconnect()

    Object.keys(this.handlers).forEach((topic) => {
      delete this.handlers[topic]
    })
  }

  onInit = async (): Promise<void> => {
    await this.consumer.connect()
  }

  public subscribe = async (topic: string, handler: EventConsumerHandler): Promise<void> => {
    await this.consumer.subscribe({ topic })
    this.handlers[topic] = handler
  }

  public run = async (): Promise<void> => {
    await this.consumer.run({
      partitionsConsumedConcurrently: 3,
      eachBatchAutoResolve: false,
      eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
        const handler = this.handlers[batch.topic]
        if (!handler) {
          throw new Error(`Handler for ${batch.topic} topic not found`)
        }

        for await (const message of batch.messages) {
          const data = JSON.parse((message?.value || '').toString())

          await handler(data)
          resolveOffset(message.offset)
          await heartbeat()
        }
      }
    })
  }
}
