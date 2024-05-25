import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import {
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CustomExceptionFilter } from '@filters/custom-exception-filter.filter';
import { ResponseInterceptor } from '@utils/interceptor/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllConfigType } from '@config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService) as ConfigService<AllConfigType>;

  const whitelist = ['http://localhost:3000', undefined];

  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new HttpException('Not allowed by CORS', 403));
      }
    },
    credentials: true,
    withCredentials: true,
  };

  app.enableCors(corsOptions);

  app.use(cookieParser());

  app.enableShutdownHooks();

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const validationErrorsResult =
          (validationErrors &&
            validationErrors.map((errors) => {
              if (errors.children.length > 0) {
                const nestedErrors = errors.children.map((child) => {
                  if (child.children.length > 0)
                    return child.children.map((child) => {
                      return {
                        property: child.property,
                        errors: Object.values(child.constraints),
                      };
                    });
                  return {
                    property: child.property,
                    errors: Object.values(child.constraints),
                  };
                });
                return nestedErrors;
              } else {
                return {
                  property: errors.property,
                  errors: Object.values(errors.constraints),
                };
              }
            })) ||
          [];
        return new UnprocessableEntityException(validationErrorsResult);
      },
    }),
  );

  //Compression
  app.use(compression());

  //Security
  app.use(helmet());

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //global exception filter
  app.useGlobalFilters(new CustomExceptionFilter());

  //global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Matching-System')
    .setDescription('Matching System API description')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
bootstrap();
