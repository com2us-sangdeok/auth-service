import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Role } from '../../../enum/user.enum';
import { CloudType, OperationType } from '../../../enum/key.enum';
import { NETWORK } from '../../../enum/blockchain.enum';

export class V1KeyDto {
  @ApiProperty({
    example: NETWORK.Xpla,
    description: 'XPLA | POLYGON',
  })
  network: NETWORK;

  @ApiProperty({
    example: CloudType.Gcp,
    description: 'GCP | AWS | AZURE',
  })
  cloudType: CloudType;

  @ApiProperty({
    example: OperationType.Mint,
    description: 'operation type (mint | convert | lock | unlock | burn)',
  })
  operationType: OperationType;

  @ApiProperty({
    example: 'hivebcsdk-test-2022',
    description: 'Google cloud project name',
  })
  @IsString()
  project: string;

  @ApiProperty({ example: 'asia-northeast3', description: 'KMS location' })
  @IsString()
  location: string;

  @ApiProperty({
    example: 'game-api-key-test',
    description: 'Name of key ring',
  })
  @IsString()
  keyRing: string;

  @ApiProperty({ example: 'test1-game-provider', description: 'Crypto key' })
  @IsString()
  cryptoKey: string;

  @ApiProperty({ example: '1', description: 'Crypto key version' })
  @IsString()
  cryptoKeyVersion: string;
}

export class UserV1Dto {
  @ApiProperty({
    example: 'com2us.c2xwallet',
    description: 'user id(alias)',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: Role.OPERATOR,
    description: 'role (admin | manager | operator)',
  })
  role: Role;

  @ApiProperty({
    example: 'test',
    description: '프로젝트 그룹 또는 회사의 ID',
  })
  tenantId: string;
}

export class V1UserServiceDto {
  @ApiProperty({
    example: 'com.com2us.c2xwallet.global.normal',
    description: 'App ID or service id(alias)',
  })
  @IsString()
  serviceid: string;

  @ApiProperty({
    type: [V1KeyDto],
    description: 'metadata-api for minting',
  })
  keys: V1KeyDto[];
}

export class V1UpdateApiKeyDto {
  @ApiProperty({
    example: 'com2us.c2xwallet',
    description: 'id',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'gCWI7MQTTZbwZiyACckJrvEk3SMW/G33K+IjfTyhX1I=',
    description: 'secret key',
  })
  @IsString()
  secretKey: string;
}

export class V1RegistUserDto extends UserV1Dto {
  address: string;
  secretKey: string;
}

export class JwtDto {
  jwt: string;
  signerAddress: string;
}
