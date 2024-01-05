import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { CloudType } from '../enum/key.enum';
import { CloudServiceType } from '../user/v1/credentials/CloudType';

@Index('uniq_credentials_01', ['credentialId'], { unique: true })
@Entity('tb_credentials')
export class CredentialsEntity {
  constructor(options?: Partial<CredentialsEntity>) {
    Object.assign(this, options);
  }

  @PrimaryGeneratedColumn('increment', { name: 'credential_no' })
  credentialNo: number;

  @Column({ name: 'credential_id', type: 'varchar', length: 100 })
  credentialId: string;

  @Column({ name: 'user_no', type: 'int' })
  userNo: number;

  @Column({ name: 'cloud_type', type: 'varchar', length: 30 })
  cloudType: string;

  @Column({ name: 'credentials', type: 'text' })
  credentials: string;

  @Column({ name: 'description', type: 'varchar', length: 50 })
  description: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
