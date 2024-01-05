import { Inject, Injectable, LoggerService } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserV1Service } from '../../user/v1/user.v1.service';
import { JwtService } from '@nestjs/jwt';
import { argonVerify, hashData } from '../../util/common.util';
import { LruCacheUtil } from '../../util/lru-cache-util';
import { ForbiddenException } from '../../exception/forbidden.exception';

@Injectable()
export class AuthV1Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    private readonly userService: UserV1Service,
    private readonly jwtService: JwtService,
    private cache: LruCacheUtil,
  ) {}

  async authToken(requestDto: any) {
    const user = await this.userService.getUser(requestDto.id);
    const payload = {
      number: user.userNo,
      id: user.id,
      role: user.role,
      tenantId: user.tenantId,
      additionalData: requestDto.additionalData,
    };

    const tokens = await this.getTokens(payload);
    const hashedRefreshToken = await hashData(tokens.refreshToken);
    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);
    return tokens;
  }

  async refreshToken(request, refreshToken: string) {
    const user = await this.userService.getUser(request.user.id);
    if (!user.refreshToken) {
      throw new ForbiddenException('access denied');
    }
    await this.verifyHashedData(user.refreshToken, refreshToken);

    const payload = {
      number: user.userNo,
      id: user.id,
      role: user.role,
      tenantId: user.tenantId,
      additionalData: request.user.additionalData,
    };
    const tokens = await this.getTokens(payload);
    const hashedRefreshToken = await hashData(tokens.refreshToken);
    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);
    return tokens;
  }

  async tokenExpiry(address: string, token: string) {
    // todo: redis에 accessToken 등록
    // this.cache.set(address, token);
    await this.userService.updateRefreshToken(address, null);
  }

  async validateUser(id: string, key: string): Promise<any> {
    const user = await this.userService.getUser(id);
    await this.verifyHashedData(user.secretKey, key);
    const { secretKey, ...result } = user;
    return result;
  }

  async verifyHashedData(hash: string, plain: string | Buffer) {
    const isMatched = await argonVerify(hash, plain);
    if (!isMatched) {
      throw new ForbiddenException();
    }
  }

  async getTokens(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('AUTH_SECRET_KEY'),
        expiresIn: this.configService.get('AUTH_ACCESS_TOKEN_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('AUTH_REFRESH_SECRET_KEY'),
        expiresIn: this.configService.get('AUTH_REFRESH_TOKEN_EXPIRES_IN'),
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
