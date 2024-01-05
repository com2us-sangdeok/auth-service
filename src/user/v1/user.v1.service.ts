import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserEntity } from '../../entities';
import { UserV1Repository } from './repository/user.v1.repository';
import {
  V1UpdateApiKeyDto,
  UserV1Dto,
  V1RegisterUserDto,
} from './dto/user.v1.dto';
import { argonVerify, hashData, randomString } from '../../util/common.util';
import { UserHttpStatus } from '../../enum/user.enum';
import { BadRequestException } from '../../exception/bad-request.exception';
import { ForbiddenException } from '../../exception/forbidden.exception';

export type User = any;

@Injectable()
export class UserV1Service {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    private readonly userRepo: UserV1Repository,
  ) {}

  async create(requestDto: V1RegisterUserDto): Promise<any> {
    return await this.userRepo.registerUser(<UserEntity>{
      id: requestDto.id,
      secretKey: requestDto.secretKey,
      role: requestDto.role,
    });
  }

  async getUser(id: string): Promise<UserEntity> {
    const user = await this.userRepo.getUserById(id);
    if (!user) {
      throw new BadRequestException(
        'user not found',
        UserHttpStatus.UserNotFound,
        HttpStatus.NO_CONTENT,
      );
    }
    return user;
  }

  async getUserWithoutSecretKey(request): Promise<any> {
    const user = await this.getUser(request.user.id);

    if (user) {
      const {
        secretKey,
        secretKeyPlainText,
        refreshToken,
        updatedAt,
        ...result
      } = user;
      return {
        ...result,
      };
    }
    return null;
  }

  async updateSecretKey(request, reqDto: V1UpdateApiKeyDto) {
    if (request.user.id !== reqDto.id) {
      throw new ForbiddenException();
    }
    const user = await this.getUser(request.user.id);

    const isMatched = await argonVerify(user.secretKey, reqDto.secretKey);
    if (!isMatched) {
      throw new ForbiddenException();
    }

    const secretKey = randomString(32, 'base64');
    const hashedApiKey = await hashData(secretKey);
    await this.userRepo.updateSecretKey(<UserEntity>{
      id: reqDto.id,
      secretKeyPlainText: secretKey,
      secretKey: hashedApiKey,
    });

    return {
      secretKey: secretKey,
    };
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    await this.userRepo.updateRefreshToken(<UserEntity>{
      id: id,
      refreshToken: refreshToken,
    });
  }

  async registerUser(requestDto: UserV1Dto): Promise<any> {
    const secretKey = randomString(32, 'base64');
    const hashedApiKey = await hashData(secretKey);

    try {
      await this.userRepo.registerUser(<UserEntity>{
        id: requestDto.id,
        secretKeyPlainText: secretKey,
        secretKey: hashedApiKey,
        role: requestDto.role,
        tenantId: requestDto.tenantId,
      });

      return {
        secretKey: secretKey,
      };
    } catch (e) {
      if (e.errno === 1062) {
        throw new BadRequestException(
          'user already existed',
          UserHttpStatus.UserExisted,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw e;
      }
    }
  }
}
