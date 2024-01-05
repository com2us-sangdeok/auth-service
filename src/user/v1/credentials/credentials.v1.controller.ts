import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CredentialsV1Service } from './credentials.v1.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../decorator/roles.decorator';
import { Role } from '../../../enum/user.enum';
import {
  CredentialsReqDto,
  UpdateCredentialsReqDto,
} from '../dto/credentials.v1.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  version: '1',
})
export class CredentialsV1Controller {
  constructor(private readonly service: CredentialsV1Service) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('user/credentials')
  @Roles(Role.OPERATOR)
  async registerCredentials(
    @Request() request,
    @Body() reqDto: CredentialsReqDto,
  ): Promise<any> {
    return await this.service.registerCredentials(request, reqDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('user/credentials/:credentialId')
  @Roles(Role.OPERATOR)
  async deleteCredentials(
    @Request() request,
    @Param('credentialId') credentialId: string,
  ): Promise<any> {
    return await this.service.deleteCredentials(request, credentialId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user/credentials/:credentialId')
  @Roles(Role.OPERATOR)
  async getCredentials(
    @Request() request,
    @Param('credentialId') credentialId: string,
  ): Promise<any> {
    return await this.service.getCredentials(request, credentialId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({
    name: 'credentialId',
    type: String,
    description: '인증정보 ID',
    required: false,
  })
  @Get('user/credentials')
  @Roles(Role.OPERATOR)
  async getCredentialsAll(
    @Request() request,
    @Query('credentialId') credentialId?: string,
  ): Promise<any> {
    return await this.service.getCredentialsAll(request, credentialId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('user/credentials/:credentialId')
  @Roles(Role.OPERATOR)
  async updateCredentials(
    @Request() request,
    @Param('credentialId') credentialId: string,
    @Body() reqDto: UpdateCredentialsReqDto,
  ): Promise<any> {
    return await this.service.updateCredentials(request, credentialId, reqDto);
  }
}
