import {Inject, Injectable, LoggerService} from '@nestjs/common';

import {ConfigService} from '@nestjs/config';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {UserEntity} from "../../entities";
import {UserRepository} from "./repository/user.repository";
import {V1UserDto} from "../../auth/v1/dto/v1.user.dto";
import {UserException, UserHttpStatus} from "../../exception/user.exception";


@Injectable()
export class V1UserService {

  private readonly BC_DECIMAL = Number(this.configService.get('BC_DECIMAL'));
  private readonly BC_GAME_DECIMAL = Number(
    this.configService.get('BC_GAME_DECIMAL'),
  );

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // private axiosClient: AxiosClientUtil,
    private configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {}

  async create(requestDto: V1UserDto): Promise<any> {
    return await this.userRepo.registerUser(<UserEntity>{
      appId: requestDto.appId,
      project: requestDto.project,
      location: requestDto.location,
      keyRing: requestDto.keyRing,
      cryptoKey: requestDto.cryptoKey,
      cryptoKeyVersion: requestDto.cryptoKeyVersion,
    })
  }

  async getKey(appId: string): Promise<UserEntity> {
    const user = await this.userRepo.getKeyDataByAppId(appId);
    if (!user) {
      throw new UserException('App ID not found', '', UserHttpStatus.NOT_FOUND)
    }
    return user
  }

}
