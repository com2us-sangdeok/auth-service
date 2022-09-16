import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserEntity
} from '../../../entities';


@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async registerUser(entity: UserEntity) {
    await this.userRepo.save(entity);
  }

  async getKeyDataByAppId(appId: string): Promise<UserEntity> {
    return await this.userRepo.findOneBy({appId: appId});
  }
}
