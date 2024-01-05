import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialsEntity } from '../../../entities/credentials.entity';

@Injectable()
export class CredentialsV1Repository {
  constructor(
    @InjectRepository(CredentialsEntity)
    private readonly repo: Repository<CredentialsEntity>,
  ) {}

  async saveCredentials(entity: CredentialsEntity) {
    return await this.repo.save(entity);
  }

  async getCredentials(credentialId: string): Promise<CredentialsEntity> {
    return await this.repo
      .createQueryBuilder('c')
      .where('c.credential_id = :id', { id: credentialId })
      .getOne();
  }

  async getCredentialsByUserIdAndCredentialId(
    userId: string,
    credentialId: string,
  ): Promise<CredentialsEntity> {
    return await this.repo
      .createQueryBuilder('c')
      .select([
        'c.credential_no as credentialNo',
        'c.credential_id as credentialId',
        'c.user_no as userNo',
        'c.cloud_type as cloudType',
        'c.credentials as credentials',
        'c.description as description',
        'c.created_at as createdAt',
        'c.updated_at as updatedAt',
      ])
      .innerJoin('tb_user', 'u', 'c.user_no = u.user_no')
      .where('u.id = :userId', { userId: userId })
      .andWhere('c.credential_id = :credentialId', {
        credentialId: credentialId,
      })
      .getRawOne();
  }

  async deleteCredentials(credentialId: string) {
    return await this.repo
      .createQueryBuilder()
      .delete()
      .where('credential_id = :id', { id: credentialId })
      .execute();
  }

  async getCredentialsAll(userId: string, credentialId?: string) {
    return await this.repo
      .createQueryBuilder('c')
      .select([
        'c.credential_id as credentialId',
        'c.cloud_type as cloudType',
        'c.credentials as credentials',
        'c.description as description',
        'c.created_at as createdAt',
      ])
      .innerJoin('tb_user', 'u', 'c.user_no = u.user_no')
      .where('u.id = :userId', { userId: userId })
      .andWhere(credentialId ? 'c.credential_id = :credentialId' : '1=1', {
        credentialId: credentialId,
      })
      .getRawMany();
  }

  async udpateCredentials(entity: CredentialsEntity) {
    const { credentialNo, ...updateData } = entity;
    return await this.repo.update(
      { credentialNo: entity.credentialNo },
      {
        ...updateData,
      },
    );
  }
}
