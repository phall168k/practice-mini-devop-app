import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnApplicationShutdown {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis,
    ) {}

    getClient(): Redis {
        return this.redis;
    }

    public async set(
        key: string,
        value: unknown,
        ttlSeconds?: number,
    ): Promise<void> {
        const serializedValue = JSON.stringify(value);

        if (ttlSeconds) {
            await this.redis.set(
                key,
                serializedValue,
                'EX',
                ttlSeconds,
            );
            return;
        }

        await this.redis.set(key, serializedValue);
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);

        if (!value) return null;

        try {
            return JSON.parse(value) as T;
        } catch {
            return value as T;
        }
    }

    public async delete(key: string): Promise<number>{ 
        return this.redis.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        const result = await this.redis.exists(key);

        return result === 1;
    }

    public async expire(
        key: string,
        ttlSeconds: number,
    ): Promise<boolean> {
        const result = await this.redis.expire(
            key,
            ttlSeconds,
        );

        return result === 1;
    }

    public ttl(key: string): Promise<number> {
        return this.redis.ttl(key);
    }

    public increment(key: string): Promise<number> {
        return this.redis.incr(key);
    }

    public decrement(key: string): Promise<number> {
        return this.redis.incr(key);
    }

    public async ping(): Promise<string> {
        return this.redis.ping();
    }

    public async onApplicationShutdown(): Promise<void> {
        if (this.redis.status === 'ready') {
            await this.redis.quit();
        }
    }    
}
