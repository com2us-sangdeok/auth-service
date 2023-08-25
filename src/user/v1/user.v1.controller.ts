import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  Request,
  Param,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserV1Service } from './user.v1.service';
import {
  V1UpdateApiKeyDto,
  UserV1Dto,
  V1UserServiceDto,
} from './dto/user.v1.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../decorator/roles.decorator';
import { Role } from '../../enum/user.enum';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  version: '1',
})
export class UserV1Controller {
  constructor(private readonly userService: UserV1Service) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('user')
  @Roles(Role.ADMIN)
  async registUser(@Body() reqDto: UserV1Dto): Promise<any> {
    return await this.userService.registUser(reqDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('user/service')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async registUserService(
    @Request() request,
    @Body() reqDto: V1UserServiceDto,
  ): Promise<any> {
    return await this.userService.registUserService(request, reqDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() request) {
    return await this.userService.getUserWithoutSecretKey(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/services')
  @ApiQuery({
    name: 'serviceId',
    example: 'com.com2us.hivesdk.c2xwallet.hivepc.kr.test',
    required: false,
  })
  async getServices(@Request() request, @Query() query) {
    return await this.userService.getServices(request, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/service/:serviceId/keys')
  @ApiQuery({
    name: 'operationType',
    example: 'MINT',
    required: false,
  })
  async getKeys(
    @Request() request,
    @Query() query,
    @Param('serviceId') serviceId: string,
  ) {
    return await this.userService.getKeys(request, query, serviceId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user/service/:serviceId/address')
  @Roles(Role.ADMIN)
  async getServicesAndOperation(
    @Request() request,
    @Param('serviceId') serviceId: string,
  ) {
    return await this.userService.getServicesAndOperation(request, serviceId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('secretkey')
  async updateSecretKey(@Request() request, @Body() reqDto: V1UpdateApiKeyDto) {
    return await this.userService.updateSecretKey(request, reqDto);
  }
}
