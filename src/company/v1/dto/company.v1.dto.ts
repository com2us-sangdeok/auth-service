import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Role } from '../../../enum/user.enum';

export const CompanyUserHeaderSwaggerParam = {
  name: 'x-company',
  description: '회사 고유 코드',
  required: true,
  schema: {
    default: '1',
  },
};

export class HeaderCompanyReqDto {
  @Expose({ name: 'x-company' })
  @IsNotEmpty()
  company: number;
}

export class CompanyUserQueryDto {
  @ApiProperty({
    example: 'com.com2us.hivesdk',
    description: '게임 ID',
  })
  @IsString()
  gameId: string;
}

export class CompanyUserBodyDto {
  @ApiProperty({
    example: 'com.com2us.hivesdk',
    description: '게임 ID',
  })
  @IsString()
  gameId: string;

  @ApiProperty({
    example: 'com.com2us.hivesdk.c2xwallet.hivepc.kr.test',
    description: '게임 ID',
  })
  @IsString()
  appId: string;

  @ApiProperty({
    example: Role.OPERATOR,
    description: 'role (admin | manager | operator)',
  })
  role: Role;
}
