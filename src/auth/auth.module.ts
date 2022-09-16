import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosClientUtil } from '../util/axios-client.util';
import {
  UserEntity,
} from '../entities';
import {V1AuthController} from "./v1/v1.auth.controller";
import {V1AuthService} from "./v1/v1.auth.service";
import {AuthRepository} from "./v1/repository/auth.repository";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {jwtConstants} from "./constants";
import {JwtModule} from "@nestjs/jwt";
import {V1UserService} from "../user/v1/v1.user.service";

@Module({
  imports: [
    WinstonModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        // maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [
    V1AuthController,
  ],
  providers: [
    V1AuthService,
    // V1UserService,
    AxiosClientUtil,
    // AuthRepository,
    LocalStrategy,
  ],
  exports: [V1AuthService]
})
export class AuthModule {}
