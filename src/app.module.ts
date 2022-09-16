import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  getLogFormat,
  typeOrmTransports,
} from './commom/logger/winston.config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import DatabaseLogger from './commom/logger/database.logger';
import { RequestContextMiddleware } from './middleware/request-context.middleware';
import {
  UserEntity,
} from './entities';
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    TerminusModule,
    HttpModule,
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        format: getLogFormat(process.env.NODE_ENV),
        transports: typeOrmTransports(process.env.NODE_ENV, configService),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [
            UserEntity,
          ],
          // synchronize: true,
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          logging: true,
          logger: new DatabaseLogger(process.env.NODE_ENV),
        } as TypeOrmModuleAsyncOptions;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware, LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
