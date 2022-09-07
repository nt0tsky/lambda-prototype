import { config } from 'dotenv'
import { hostname } from 'os'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const bootstrap = async () => {
  config()

  const container = createServiceContainer({
    serviceName: 'hitsSpeedLayer',
    brokers: process.env?.BROKERS?.split(',') || [],
    hostname: hostname(),
    redisUrl: process.env?.REDIS_URL || '127.0.0.1:6379'
  })

  const service = container.build(createService)

  await service.onInit()
}

bootstrap()
