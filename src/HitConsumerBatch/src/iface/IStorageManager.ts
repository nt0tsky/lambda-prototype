import { IHitDTO } from '@lambda/core/models'

export interface IHitFilter {
  dateStart?: string
}

export interface IHitStatsDTO {
  count: string
  date: string
}

export interface IStorageManager {
  addHit: (data: IHitDTO) => Promise<void>
  statsByDate: (where: IHitFilter) => Promise<IHitStatsDTO[]>
}
