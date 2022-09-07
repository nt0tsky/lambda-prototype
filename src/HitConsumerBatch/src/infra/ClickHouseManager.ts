import { Logger } from '@lambda/core/infra/logger'
import { IHitDTO } from '@lambda/core/models'
import axios, { AxiosInstance } from 'axios'
import { Agent } from 'http'
import { IServiceCradle, IStorageManager } from '../iface'

export class ClickHouseManager implements IStorageManager {
  private readonly httpService: AxiosInstance

  private readonly logger: Logger

  constructor({ clickhouseUrl, logger }: IServiceCradle) {
    this.httpService = axios.create({
      baseURL: clickhouseUrl,
      httpAgent: new Agent({
        keepAlive: true
      })
    })
    this.logger = logger
  }

  private createAddHitQuery = (data: IHitDTO): string =>
    `
        INSERT INTO lambda.hits (date, url, ip, ua) 
        VALUES (
            parseDateTimeBestEffort('${data.date}'),
            '${data.url}',
            '${data.ip}',
            '${data.ua}'
        )
    `

  public addHit = async (data: IHitDTO): Promise<void> => {
    const query = this.createAddHitQuery(data)

    this.logger.info(query)

    await this.httpService.post('/', this.createAddHitQuery(data))
  }
}
