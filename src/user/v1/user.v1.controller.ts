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
  async registerUser(@Body() reqDto: UserV1Dto): Promise<any> {
    return await this.userService.registerUser(reqDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() request) {
    return await this.userService.getUserWithoutSecretKey(request);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/secretkey')
  async updateSecretKey(@Request() request, @Body() reqDto: V1UpdateApiKeyDto) {
    return await this.userService.updateSecretKey(request, reqDto);
  }
}
