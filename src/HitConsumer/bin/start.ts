import { config } from 'dotenv'
import { hostname } from 'os'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const bootstrap = async () => {
  config()

  const container = createServiceContainer({
    serviceName: 'hitsIngestorLayer',
    brokers: process.env?.BROKERS?.split(',') || [],
    hostname: hostname()
  })

  const service = container.build(createService)

  await service.onInit()
}

bootstrap()
