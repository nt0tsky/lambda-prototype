import { config } from 'dotenv'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const bootstrap = async () => {
  config()

  const container = createServiceContainer({
    serviceName: 'hitsSpeedLayer',
    brokers: process.env?.BROKERS?.split(',') || [],
    nodeId: Number(process.env.NODE_ID) || 1,
    redisUrl: process.env?.REDIS_URL || '127.0.0.1:6379'
  })

  const service = container.build(createService)

  await service.onInit()
}

bootstrap()
