import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { CompanyV1Service } from './company.v1.service';
import { Roles } from '../../decorator/roles.decorator';
import { Role, UserHttpStatus } from '../../enum/user.enum';
import {
  CompanyUserBodyDto,
  CompanyUserHeaderSwaggerParam,
  CompanyUserQueryDto,
  HeaderCompanyReqDto,
} from './dto/company.v1.dto';
import { RequestHeader } from '../../decorator/request.decorator';
import { randomString } from '../../util/common.util';
import { BadRequestException } from '../../exception/bad-request.exception';
import { log } from 'winston';

@ApiBearerAuth()
@ApiTags('Company')
@Controller({
  version: '1',
})
export class CompanyV1Controller {
  constructor(private readonly companyService: CompanyV1Service) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('company/user')
  @ApiHeaders([CompanyUserHeaderSwaggerParam])
  @Roles(Role.OPERATOR)
  async createCompanyUser(
    @RequestHeader(HeaderCompanyReqDto) headers,
    @Body() request: CompanyUserBodyDto,
  ): Promise<any> {
    /** user 테이블에 gameid 가 등록되어 있는지 확인 */
    let user;
    try {
      user = await this.companyService.findCompanyUser(
        headers.company,
        request.gameId,
      );
    } catch (e) {
      /** 신규 등록일 경우 */
      user = await this.companyService.createCompanyUser(
        headers.company,
        request.gameId,
        request.appId,
        Role.OPERATOR,
      );
    }

    const userNo = user.userNo;

    console.log(user);

    /** service 테이블에 appid 가 등록되어 있는지 확인 */
    const service = await this.companyService.chkCompanyService(
      userNo,
      request.appId,
    );

    /** 이미 등록된 경우 에러 처리 */
    if (service) {
      throw new BadRequestException(
        'duplicate user service',
        UserHttpStatus.DuplicateService,
        HttpStatus.CONFLICT,
      );
    }

    /** 등록되지 않은 경우 service 등록 요청 */
    return await this.companyService.createCompanyUserService(
      userNo,
      request.appId,
    );
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('company/user')
  @ApiHeaders([CompanyUserHeaderSwaggerParam])
  // @Roles(Role.ADMIN)
  async findCompanyUser(
    @RequestHeader(HeaderCompanyReqDto) headers,
    @Query() query: CompanyUserQueryDto,
  ): Promise<any> {
    const user = await this.companyService.findCompanyUser(
      headers.company,
      query.gameId,
    );
    return {
      serviceId: user.serviceId,
      secretKey: user.secretKey,
    };
  }
}
