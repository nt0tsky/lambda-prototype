import { Logger } from '@lambda/core/infra/logger'
import { config } from 'dotenv'
import { createServer } from 'http'
import process from 'node:process'
import { createExpressServer } from '../src/api'
import { createServiceContainer } from '../src/container'
import { createService } from '../src/service'

const gracefulShutdown = (logger: Logger, cb: () => Promise<void>): void => {
  const events = ['SIGINT', 'SIGTERM', 'uncaughtException']
  events.forEach((event) => {
    process.on(event, async (args: unknown) => {
      // eslint-disable-next-line no-console
      logger.warn(`${event} signal received. ${args}`)
      try {
        await cb()
      } catch (err) {
        process.exit(1)
      }

      process.exit(0)
    })
  })
}

const bootstrap = async () => {
  config()

  const hostname = '0.0.0.0'
  const port = Number(process.env?.PORT) || 6000

  const container = createServiceContainer({
    serviceName: 'hitsService',
    brokers: process.env?.BROKERS?.split(',') || [],
    port,
    nodeId: Number(process.env?.NODE_ID) || 1,
    redisUrl: process.env?.REDIS_URL || '127.0.0.1:6379'
  })
  const logger = container.resolve('logger')
  const service = container.build(createService)
  const httpService = container.build(createExpressServer)

  await service.onInit()
  const server = createServer(httpService).listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    logger.info(`server is running at: ${hostname}:${port}`)
  })

  gracefulShutdown(logger, async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err.message)
        } else {
          resolve()
        }
      })
    })

    await service.onDestroy()
  })
}

bootstrap()
