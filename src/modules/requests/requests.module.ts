import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Utils } from '@utils/utils';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { RedisService } from '@modules/redis/redis.service';
import { Request, RequestSchema } from './schemas/requests.schema';
import { RequestsService } from './services/requests.service';
import { RequestsController } from './controllers/requests.controller';
import { RequestRepository } from './repositories/request.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
  ],
  providers: [
    RequestRepository,
    RequestsService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [RequestsController],
  exports: [RequestsService],
})
export class RequestsModule {}
