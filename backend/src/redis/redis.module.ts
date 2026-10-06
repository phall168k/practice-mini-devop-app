import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT', 6379),
          password: configService.getOrThrow<string>('REDIS_PASSWORD') || undefined,
          db: configService.getOrThrow<number>('REDIS_DB', 0),
          lazyConnect: true,
          connectTimeout: 10_000,
          maxRetriesPerRequest: 3,
          retryStrategy(time) {
            const delay = Math.min(time * 200, 5000);
            return delay;
          },
        });

        redis.on('connect', () => {
          console.log('[Redis] Connecting...');
        });

        redis.on('ready', () => {
          console.log('[Redis] Connection ready');
        });

        redis.on('error', (error) => {
          console.log('[Redis] Connection error:', error.message);
        });

        redis.on('close', () => {
          console.warn('[Redis] Connection closed');
        });

        await redis.connect();

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],

  exports: [
    REDIS_CLIENT,
    RedisService,
  ],
})
export class RedisModule {}
