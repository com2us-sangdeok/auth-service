import { Inject, Injectable, LoggerService } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {AxiosClientUtil} from "../../util/axios-client.util";
import {AuthRepository} from "./repository/auth.repository";
import {UserEntity} from "../../entities";
import {V1AuthDto} from "./dto/v1.auth.dto";
import {V1UserService} from "../../user/v1/v1.user.service";
import {JwtService} from "@nestjs/jwt";
import {V1UserDto} from "./dto/v1.user.dto";


@Injectable()
export class V1AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // private axiosClient: AxiosClientUtil,
    private configService: ConfigService,
    // private readonly userRepo: AuthRepository,
    private readonly userService: V1UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(appId: string, apiKey: string): Promise<any> {
    const user = await this.userService.getKey(appId);
    if (user && user.apiKey === apiKey) {
      const {apiKey , ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { appId: user.appId, sub: user.project };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
