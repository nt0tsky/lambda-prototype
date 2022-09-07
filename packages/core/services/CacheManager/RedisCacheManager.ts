import Redis from 'ioredis'
import { ICacheManager } from './ICacheManager'

export class RedisCacheManager implements ICacheManager {
  private readonly redis: Redis

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl)
  }

  add = async <T>(key: string, data: T): Promise<void> => {
    await this.redis.set(key, JSON.stringify(data))
  }

  get = async <T>(key: string): Promise<T | null> => {
    const value = await this.redis.get(key)

    return value ? JSON.parse(value) as T : null
  }
}
