import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MatsMethodBaseDTO, MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodChecksService } from './mats-method-checks.service';
import { MatsMethodWorkspaceService } from './mats-method.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Methods')
export class MatsMethodWorkspaceController {
  constructor(
    private readonly service: MatsMethodWorkspaceService,
    private readonly checkService: MatsMethodChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MatsMethodDTO,
    description:
      'Retrieves workspace copy MATS Method records for a monitor location',
  })
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
  getMethods(@Param('locId') locationId: string): Promise<MatsMethodDTO[]> {
    return this.service.getMethods(locationId);
  }

  @Post()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Creates workspace MATS Method record',
  })
  async createMethod(
    @Param('locId') locationId: string,
    @Body() payload: MatsMethodBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MatsMethodDTO> {
    await this.checkService.runChecks(payload);
    return this.service.createMethod(locationId, payload, user.userId);
  }

  @Put(':methodId')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Updates workspace MATS Method record',
  })
  async updateMethod(
    @Param('locId') locationId: string,
    @Param('methodId') methodId: string,
    @Body() payload: MatsMethodBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MatsMethodDTO> {
    await this.checkService.runChecks(payload, false, true);
    return this.service.updateMethod(
      methodId,
      locationId,
      payload,
      user.userId,
    );
  }
}
