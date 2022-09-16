import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import {
  UserEntity
} from '../../../entities';


@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    // private readonly userRepo: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async registerUser(entity: UserEntity) {
    // await this.userRepo.save(entity);
  }
}
