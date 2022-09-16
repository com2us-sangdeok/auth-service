import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosClientUtil } from '../util/axios-client.util';
import {
  UserEntity,
} from '../entities';
import {V1UserService} from "./v1/v1.user.service";
import {UserRepository} from "./v1/repository/user.repository";
// import {V1AuthController} from "./v1/v1.auth.controller";
// import {V1AuthService} from "./v1/v1.auth.service";
// import {AuthRepository} from "./v1/repository/auth.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
    WinstonModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        // maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    // V1AuthController,
  ],
  providers: [
    V1UserService,
    // AxiosClientUtil,
    UserRepository,
  ],
  exports: [V1UserService, UserRepository]
})
export class UserModule {}
