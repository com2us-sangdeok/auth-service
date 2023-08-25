import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Index('idx_service_01', ['serviceId'])
@Entity('tb_service')
export class ServiceEntity {
  constructor(options?: Partial<ServiceEntity>) {
    Object.assign(this, options);
  }

  @PrimaryGeneratedColumn('increment', { name: 'service_no' })
  serviceNo: number;

  @Column({ name: 'service_id', type: 'varchar', length: 100 })
  serviceId: string;

  @Column({ name: 'user_no', type: 'int' })
  userNo: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
