import { Injectable } from '@nestjs/common';
import { RedisService } from '@modules/redis/redis.service';

@Injectable()
export class Utils {
  constructor(private readonly redisService: RedisService) {}

  async redisSetValue(key: string, value: string): Promise<void> {
    const redisClient = this.redisService.getRedisClient();
    await redisClient.set(key, value);
  }

  async redisGetValue(key: string): Promise<string | null> {
    const redisClient = this.redisService.getRedisClient();
    return await redisClient.get(key);
  }

  formatPhoneNumber(phone: string): string {
    if (!phone.startsWith('+20') && !phone.startsWith('20')) {
      phone = '+20' + phone;
    } else if (phone.startsWith('20')) {
      phone = '+' + phone;
    }
    return phone;
  }
}
