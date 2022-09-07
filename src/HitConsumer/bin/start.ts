import { config } from 'dotenv'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const bootstrap = async () => {
  config()

  const container = createServiceContainer({
    serviceName: 'hitsIngestorLayer',
    brokers: process.env?.BROKERS?.split(',') || [],
    nodeId: Number(process.env.NODE_ID) || 1
  })

  const service = container.build(createService)

  await service.onInit()
}

bootstrap()