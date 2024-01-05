import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CloudServices, CloudServiceType } from '../credentials/CloudType';

export class CredentialsDto {
  @ApiProperty({
    example: 'blockchain-api@hivebcsdk-test-2022.iam.gserviceaccount.com',
    description: 'KMS에 접근가능한 ID',
  })
  @IsString()
  accessKeyId: string;

  @ApiProperty({
    example: '-----BEGIN PRIVATE KEY-----',
    description: 'KMS에 접근 시 필요한 Secret',
  })
  @IsString()
  accessKeySecret: string;

  @ApiProperty({
    example: '-----BEGIN PRIVATE KEY-----',
    description: 'AWS: KMS의 등록 위치정보, GCP: 없음',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;
}

export class CloudTypeDto {
  @ApiProperty({
    example: 'gcp',
    description: '클라우드 종류',
  })
  @IsIn(CloudServices)
  @Transform(({ value }) => value?.toLowerCase())
  cloudType: CloudServiceType;
}

export class CredentialsReqDto extends CloudTypeDto {
  @ApiProperty({
    description: '클라우드 KMS 옵션',
    type: CredentialsDto,
    example: CredentialsDto,
  })
  @ValidateNested()
  @Type(() => CredentialsDto)
  credentials: CredentialsDto;

  @ApiProperty({
    example: 'GCP KMS-Hive test 인증정보',
    description: 'KMS에 접근 시 필요한 Secret',
  })
  @IsString()
  description: string;
}

export type Credential = GcpKmsCredential | AwsKmsCredential;

export class GcpKmsCredential {
  @ApiProperty({
    example: 'blockchain-api@hivebcsdk-test-2022.iam.gserviceaccount.com',
    description: '사용자의 이메일',
  })
  @IsString()
  clientEmail: string;

  @ApiProperty({
    example: '-----BEGIN PRIVATE KEY-----',
    description: '사용자의 비밀키',
  })
  @IsString()
  privateKey: string;
}

export class AwsKmsCredential {
  @ApiProperty({
    example: '',
    description: '사용자의 키아이디',
  })
  @IsString()
  accessKeyId: string;

  @ApiProperty({
    example: '',
    description: '사용자의 접근키',
  })
  @IsString()
  secretAccessKey: string;

  @ApiProperty({
    example: '',
    description: '사용자의 위치정보',
  })
  @IsString()
  region: string;
}

export class UpdateCredentialsReqDto extends CloudTypeDto {
  @ApiProperty({
    description: '클라우드 KMS 옵션',
    type: CredentialsDto,
    example: CredentialsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CredentialsDto)
  credentials?: CredentialsDto;

  @ApiProperty({
    example: 'GCP KMS-Hive test 인증정보',
    description: 'KMS에 접근 시 필요한 Secret',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
