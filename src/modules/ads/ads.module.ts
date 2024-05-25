import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Utils } from '@utils/utils';
import { RedisService } from '@modules/redis/redis.service';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { Ad, AdSchema } from './schemas/ads.schema';
import { AdsService } from './services/ads.service';
import { AdsController } from './controllers/ads.controller';
import { RequestsModule } from '@modules/requests/requests.module';
import { AdRepository } from './repositories/ad.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ad.name, schema: AdSchema }]),
    RequestsModule,
  ],
  providers: [AdRepository, AdsService, JwtStrategy, Utils, RedisService],
  controllers: [AdsController],
  exports: [AdsService],
})
export class AdsModule {}
