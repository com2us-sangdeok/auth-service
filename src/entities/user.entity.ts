import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Role } from '../enum/user.enum';

@Index('uniq_user_01', ['id'], { unique: true })
@Entity('tb_user')
export class UserEntity {
  constructor(options?: Partial<UserEntity>) {
    Object.assign(this, options);
  }

  @PrimaryGeneratedColumn('increment', { name: 'user_no' })
  userNo: number;

  @Column({ name: 'id', type: 'varchar' })
  id: string;

  @Column({ name: 'secret_key', type: 'varchar', length: 100 })
  secretKey: string;

  @Column({ name: 'role', type: 'enum', enum: Role, default: Role.OPERATOR })
  role: Role;

  @Column({ name: 'tenant_id', type: 'varchar', length: 50, nullable: true })
  tenantId: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
