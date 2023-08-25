import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  Unique,
} from 'typeorm';
import { NETWORK } from '../enum/blockchain.enum';
import { CloudType } from '../enum/key.enum';
import {
  AwsOptionDto,
  AzureOptionDto,
  GoogleOptionDto,
} from '../user/v1/dto/key.v1.dto';

// @Index('uniq_key_01', ['network, address'], { unique: true })
@Entity('tb_key')
export class KeyEntity {
  constructor(options?: Partial<KeyEntity>) {
    Object.assign(this, options);
  }

  @PrimaryGeneratedColumn('increment', { name: 'key_no' })
  keyNo: number;

  @Column({
    name: 'network',
    type: 'enum',
    enum: NETWORK,
    default: NETWORK.Polygon,
    comment: '블록체인 종류 (polygon, xpla)',
  })
  network: NETWORK;

  @Column({ name: 'address', type: 'varchar', length: 64 })
  address: string;

  @Column({
    name: 'cloud_type',
    type: 'enum',
    enum: CloudType,
    default: CloudType.Gcp,
  })
  cloudType: CloudType;

  @Column({
    name: 'key_options',
    type: 'json',
    nullable: false,
    comment: 'Key 옵션 정보',
  })
  keyOptions: GoogleOptionDto | AwsOptionDto | AzureOptionDto;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
