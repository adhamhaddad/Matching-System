import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Utils } from '@utils/utils';
import { PasswordHash } from '@utils/password-hash';
import { jwtFactory } from './config/jwt.config';
import { AuthService } from './services/auth.service';
import { User, UserSchema } from '../users/schemas/users.schema';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { RedisModule } from '@modules/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    RedisModule,
    UsersModule,
  ],
  providers: [AuthService, PasswordHash, Utils],
  controllers: [AuthController],
})
export class AuthModule {}
