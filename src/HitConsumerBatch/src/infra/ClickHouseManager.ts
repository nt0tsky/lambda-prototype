import { Logger } from '@lambda/core/infra/logger'
import { IHitDTO } from '@lambda/core/models'
import axios, { AxiosInstance } from 'axios'
import { Agent } from 'http'
import {
  IHitFilter, IHitStatsDTO, IServiceCradle, IStorageManager
} from '../iface'

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

  private createWhereHitFilter = (data: IHitFilter): string =>
    `
      SELECT COUNT(*) as count, Date(date) as date
      FROM lambda.hits
      WHERE date >= parseDateTimeBestEffort('${data.dateStart}')
      GROUP by date
      FORMAT JSON
    `

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

    await this.httpService.post('/', query)
  }

  public statsByDate = async (where: IHitFilter): Promise<IHitStatsDTO[]> => {
    const query = this.createWhereHitFilter(where)

    this.logger.info(query)
    const { data: { data } } = await this.httpService.post<{ data: IHitStatsDTO[] }>('/', query)

    return data
  }

  public query = async (data: string): Promise<void> => {
    await this.httpService.post('/', data)
  }
}
