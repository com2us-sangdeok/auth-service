import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../entities';
import { UserServiceOperationEntity } from '../../../entities/user-service-operation.entity';
import { ServiceEntity } from '../../../entities/service.entity';
import { KeyEntity } from '../../../entities/key.entity';
import { OperationType } from '../../../enum/key.enum';

@Injectable()
export class UserV1Repository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(UserServiceOperationEntity)
    private readonly userServiceOperationRepo: Repository<UserServiceOperationEntity>,
    @InjectRepository(KeyEntity)
    private readonly keyRepo: Repository<KeyEntity>,
  ) {}

  // User
  async registerUser(entity: UserEntity) {
    return await this.userRepo.save(entity);
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.userRepo
      .createQueryBuilder('u')
      .where('u.id = :id', { id: id })
      .getOne();
  }

  async updateSecretKey(user: UserEntity) {
    return await this.userRepo
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        secretKey: user.secretKey,
        secretKeyPlainText: user.secretKeyPlainText,
      })
      .where('id = :id', { id: user.id })
      .execute();
  }

  async updateRefreshToken(user: UserEntity) {
    return await this.userRepo
      .createQueryBuilder()
      .update(UserEntity)
      .set({ refreshToken: user.refreshToken })
      .where('id = :id', { id: user.id })
      .execute();
  }
}
