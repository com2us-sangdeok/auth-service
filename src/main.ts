import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { getLogFormat, logLevel } from './commom/logger/winston.config';
import * as winston from 'winston';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';

/*
  todo:
    Security (auth)
 */
async function bootstrap() {
  const appOptions = {
    cors: true,
    bodyParser: true,
    //winstonLogger
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: logLevel(process.env.NODE_ENV),
          format: getLogFormat(process.env.NODE_ENV),
        }),
      ],
    }),
  };
  const app = await NestFactory.create(AppModule, appOptions);
  const configService = app.get(ConfigService);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix(configService.get('APP_ROOT_PREFIX'));
  app.enableVersioning({
    type: VersioningType.URI,
    //fixme: default 설정으로 모든 contoller 버전 컨트롤
    // defaultVersion: [VERSION_NEUTRAL],
    // defaultVersion: '2',
  });

  const config = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE'))
    .setDescription(configService.get('SWAGGER_DESC'))
    .setVersion(configService.get('SWAGGER_VERSION'))
    // .addTag('blockchain')
    .addBearerAuth()
    .build();

  const option: SwaggerDocumentOptions = {
    include: [AuthModule, UserModule],
    deepScanRoutes: false,
  };

  const document = SwaggerModule.createDocument(app, config, option);
  SwaggerModule.setup(configService.get('SWAGGER_PATH'), app, document);

  await app.listen(configService.get('APP_PORT'));
}

bootstrap();
