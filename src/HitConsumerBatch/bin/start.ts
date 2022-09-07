import { config } from 'dotenv'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const bootstrap = async () => {
  config()

  const container = createServiceContainer({
    serviceName: 'hitsBatchLayer',
    clickhouseUrl: process.env?.CLICKHOUSE_URL || 'http://127.0.0.1:8124',
    redisUrl: process.env?.REDIS_URL || '127.0.0.1:6379',
    brokers: process.env?.BROKERS?.split(',') || [],
    nodeId: Number(process.env.NODE_ID) || 1
  })

  const service = container.build(createService)

  await service.onInit()
}

bootstrap()
