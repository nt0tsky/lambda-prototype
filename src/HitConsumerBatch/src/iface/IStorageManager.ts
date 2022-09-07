import { IHitDTO } from '@lambda/core/models'

export interface IStorageManager {
  addHit: (data: IHitDTO) => Promise<void>
}
