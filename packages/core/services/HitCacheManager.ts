import { IHitDTO } from '../models'
import { ICacheManager } from './CacheManager'

interface IVisitorDTO extends Record<string, unknown> {
  key: string
  model: IHitDTO
}

export class HitCacheManager {
  private readonly cacheManager: ICacheManager

  constructor(cacheManager: ICacheManager) {
    this.cacheManager = cacheManager
  }

  public getHitKey = (model: IHitDTO): string =>
    `${model.url}:${model.ua}:${model.date}`

  public writeVisitor = async (model: IHitDTO): Promise<void> => {
    const key = this.getHitKey(model)
    const response = await this.cacheManager.get<IVisitorDTO>(key) || { key, model }

    await this.cacheManager.add<IVisitorDTO>(key, response)
  }
}
