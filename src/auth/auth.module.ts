import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AuthV1Controller } from './v1/auth.v1.controller';
import { AuthV1Service } from './v1/auth.v1.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { LruCacheUtil } from '../util/lru-cache-util';

@Module({
  imports: [WinstonModule, UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthV1Controller],
  providers: [
    AuthV1Service,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    LruCacheUtil,
  ],
  exports: [AuthV1Service],
})
export class AuthModule {}
