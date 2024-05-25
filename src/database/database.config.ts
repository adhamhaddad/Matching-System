import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const DatabaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions | MongooseModuleOptions> => {
  const host = configService.get<string>('DATABASE_HOST');
  const port = configService.get<number>('DATABASE_PORT');
  const userName = configService.get<string>('DATABASE_USERNAME');
  const databaseName = configService.get<string>('DATABASE_NAME');
  const password = configService.get<string>('DATABASE_PASSWORD');

  // is mongoose or typeorm
  const mongoURL = `mongodb://${userName}:${password}@${host}:${port}/${databaseName}`;
  return {
    uri: mongoURL,
  };
};
