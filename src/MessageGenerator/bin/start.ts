import { config } from 'dotenv'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const bootstrap = async () => {
  config()

  const container = createServiceContainer({
    serviceName: 'message-generator',
    brokers: process.env?.BROKERS?.split(',') || [],
    nodeId: Number(process.env.NODE_ID) || 1,
    sendInterval: Number(process.env.SEND_INTERVAL) || 3000
  })

  const service = container.build(createService)

  await service.onInit()
}

bootstrap()
