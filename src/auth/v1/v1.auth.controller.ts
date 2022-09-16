import {Body, Controller, Get, Headers, Post, Query, UseGuards} from '@nestjs/common';
import { V1AuthService } from './v1.auth.service';
import {
  GameApiV1ResponseValidItemDto,
  headerParams, V1AuthDto,
} from './dto/v1.auth.dto';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {CommonResponseDto} from "../../commom/dto/common-response.dto";
import {UserHttpStatus} from "../../exception/user.exception";
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {UserEntity} from "../../entities";
import {V1UserDto} from "./dto/v1.user.dto";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags('User API')
@Controller({
  version: '1',
})
export class V1AuthController {
  constructor(private readonly authService: V1AuthService) {}


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
      @Query('appId') appId: string,
      @Query('apiKey') apiKey: string,
  ) {
    const reqDto = {
      appId: appId,
      apiKey: apiKey
    }
    return this.authService.login(reqDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
      @Query('appId') appId: string,
  ) {
    return appId;
  }

}
