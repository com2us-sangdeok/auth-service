import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  constructor(options?: Partial<UserEntity>) {
    Object.assign(this, options);
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'app_id', type: 'varchar' })
  @Index('idx_app_id')
  appId: string;

  @Column({ type: 'varchar', length: 100 })
  apiKey: string;

  @Column({ type: 'varchar', length: 50 })
  project: string;

  @Column({ type: 'varchar', length: 50 })
  location: string;

  @Column({ name: 'key_ring', type: 'varchar', length: 50 })
  keyRing: string;

  @Column({ name: 'crypto_key', type: 'varchar', length: 50 })
  cryptoKey: string;

  @Column({ name: 'crypto_key_version', type: 'varchar', length: 3 })
  cryptoKeyVersion: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateAt: Date;
}
