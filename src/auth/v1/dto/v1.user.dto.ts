import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class V1UserDto {
  @ApiProperty({ example: 'com.com2us.c2xwallet.global.normal', description: 'App ID' })
  @IsString()
  appId: string;

  @ApiProperty({ example: 'hivebcsdk-test-2022', description: 'Google cloud project name' })
  @IsString()
  project: string;

  @ApiProperty({ example: 'asia-northeast3', description: 'KMS location' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'game-api-key-test', description: 'Name of key ring' })
  @IsString()
  keyRing: string;

  @ApiProperty({ example: 'game-provider', description: 'Crypto key' })
  @IsString()
  cryptoKey: string;

  @ApiProperty({ example: '1', description: 'Crypto key version' })
  @IsString()
  cryptoKeyVersion: string;
}
