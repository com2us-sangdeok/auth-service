import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { AuthV1Service } from './auth.v1.service';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { V1LoginDto } from './dto/auth.v1.dto';
import { RefreshJwtAuthGuard } from '../guards/refresh-jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller({
  version: '1',
})
export class AuthV1Controller {
  constructor(private readonly authService: AuthV1Service) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Get a auth-token to access blockchain game API' })
  @Post('auth-token')
  async authToken(@Body() loginDto: V1LoginDto) {
    const requestDto = {
      ...loginDto,
    };
    return await this.authService.authToken(requestDto);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @ApiOperation({
    summary: 'Get a auth-token to access blockchain game API by refresh-token',
  })
  @Post('refresh-token')
  async refreshToken(@Headers() headers, @Request() request) {
    const refreshToken = headers['authorization'].replace('Bearer', '').trim();
    return await this.authService.refreshToken(request, refreshToken);
  }

  // todo: jwt 검증 시 redis에 auth-token 확인
  //    auth-token 이 있다면 access 거부
  //    redis에 기록된 auth-token에 유효기간 부여 후 자동 삭제 처리
  //    예외 발생 시 처리

  // @UseGuards(JwtAuthGuard)
  // @Get('token-expiry')
  // async tokenExpiry(@Headers() headers, @Request() request) {
  //   const token = headers['authorization'].replace('Bearer', '').trim();
  //   const result = await this.authService.tokenExpiry(
  //     request.user.address,
  //     token,
  //   );
  //   return new CommonResponseDto<any>(UserHttpStatus.OK, 'success', result);
  // }
}
