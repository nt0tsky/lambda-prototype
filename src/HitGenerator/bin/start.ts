import { config } from 'dotenv'
import { hostname } from 'os'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const bootstrap = async () => {
  config()

  const container = createServiceContainer({
    serviceName: 'hitGenerator',
    brokers: process.env?.BROKERS?.split(',') || [],
    hostname: hostname(),
    sendInterval: Number(process.env.SEND_INTERVAL) || 3000
  })

  const service = container.build(createService)

  await service.onInit()
}

bootstrap()
