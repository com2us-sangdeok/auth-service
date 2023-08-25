import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OperationType } from '../enum/key.enum';

@Index('uniq_user_service_operation_01', ['userNo', 'serviceNo', 'keyNo'], {
  unique: true,
})
@Entity('tb_user_service_operation')
export class UserServiceOperationEntity {
  constructor(options?: Partial<UserServiceOperationEntity>) {
    Object.assign(this, options);
  }

  @PrimaryGeneratedColumn('increment', { name: 'seq_no' })
  seqNo: number;

  @Column({ name: 'user_no', type: 'int' })
  userNo: number;

  @Column({ name: 'service_no', type: 'int' })
  serviceNo: number;

  @Column({ name: 'key_no', type: 'int' })
  keyNo: number;

  @Column({ name: 'operation_type', type: 'enum', enum: OperationType })
  operationType: OperationType;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
