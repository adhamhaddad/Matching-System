import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdsModule } from './modules/ads/ads.module';
import { RequestsModule } from './modules/requests/requests.module';
import { appConfig, config } from './config';
import { LoggerMiddleware } from '@middlewares/logger.middleware';
import { DatabaseConfig } from '@database/database.config';
import { AdminModule } from '@modules/admin/admin.module';
import { RedisModule } from '@modules/redis/redis.module';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, config],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        (await DatabaseConfig(configService)) as MongooseModuleOptions,
    }),
    RedisModule,
    AuthModule,
    AdminModule,
    UsersModule,
    RequestsModule,
    AdsModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer): void {
    if (this.configService.get('app.nodeEnv') == 'development') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
