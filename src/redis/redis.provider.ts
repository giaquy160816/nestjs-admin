import { createClient, RedisClientType } from 'redis';

export const RedisProvider: {
  provide: string;
  useFactory: () => Promise<RedisClientType>;
} = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client: RedisClientType = createClient({
      url: 'redis://localhost:6379',
    });

    client.on('error', (err) => console.error('Redis error:', err));
    await client.connect();
    return client;
  },
};