import { Redis } from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';

import { REDIS_CONFIG_PROVIDER } from './redis.constant';

@Injectable()
export class RedisService {
    public constructor(@Inject(REDIS_CONFIG_PROVIDER) private readonly redisInstance: Redis) {}

    /**
     * 判断当前的key是否存在
     * @param key
     * @returns
     */
    public async exists(key: string): Promise<boolean> {
        const result = await this.redisInstance.exists(key);

        return Boolean(result);
    }

    /**
     * 给指定的key值配置过期时间
     * @param key
     * @param expire
     * @returns
     */
    public async expire(key: string, expire: number): Promise<boolean> {
        const result = await this.redisInstance.expire(key, expire);

        return Boolean(result);
    }

    /**
     * 设置值
     * @param key
     * @param value
     * @param expire
     */
    public async set(key: string, value: string | number | Buffer, expire?: number): Promise<void> {
        const expireTime = expire && isNaN(expire) ? undefined : Number(expire);

        typeof expireTime !== 'undefined'
            ? await this.redisInstance.setex(key, expireTime, JSON.stringify(value))
            : await this.redisInstance.set(key, JSON.stringify(value));
    }

    /**
     * 获取值
     * @param key
     * @param defaultValue
     * @returns
     */
    public async get<T, U = T>(key: string, defaultValue?: U): Promise<T | U> {
        const result = await this.redisInstance.get(key);

        return result ? JSON.parse(result) : defaultValue;
    }

    // public async delete(key: string): Promise<void> {}
}
