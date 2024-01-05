import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ServiceV1Service } from './service.v1.service';
import { V1UserServiceDto } from './../dto/user.v1.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../decorator/roles.decorator';
import { Role } from '../../../enum/user.enum';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  version: '1',
})
export class ServiceV1Controller {
  constructor(private readonly userService: ServiceV1Service) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('user/service')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async registerUserService(
    @Request() request,
    @Body() reqDto: V1UserServiceDto,
  ): Promise<any> {
    return await this.userService.registerUserService(request, reqDto);
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
}
