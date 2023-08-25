import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class V1LoginDto {
  @ApiProperty({
    example: 'com.com2us.c2xwallet.global.normal',
    description: 'operator address',
  })
  @IsString()
  id: string;

  @ApiProperty({ example: '1234', description: 'secret key' })
  @IsString()
  secretKey: string;

  @ApiProperty({ example: { userId: 'hive' }, description: 'additional data' })
  @IsOptional()
  additionalData?: Object;
}
