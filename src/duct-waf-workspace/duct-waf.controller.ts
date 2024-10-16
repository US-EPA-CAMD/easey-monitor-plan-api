import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { DuctWafBaseDTO, DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafWorkspaceService } from './duct-waf.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rectangular Duct WAF')
export class DuctWafWorkspaceController {
  constructor(private readonly service: DuctWafWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: DuctWafDTO,
    description: 'Retrieves workspace duct waf records for a monitor location',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getDuctWafs(@Param('locId') locationId: string): Promise<DuctWafDTO[]> {
    return this.service.getDuctWafs(locationId);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: DuctWafDTO,
    description: 'Create a workspace duct waf record for a monitor location',
  })
  async createDuctWaf(
    @Param('locId') locationId: string,
    @Body() payload: DuctWafBaseDTO,
    @User() user: CurrentUser,
  ): Promise<DuctWafDTO> {
    return this.service.createDuctWaf({
      locationId,
      payload,
      userId: user.userId,
    });
  }

  @Put(':ductWafId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: DuctWafDTO,
    description: 'Updates a workspace duct waf record for a monitor location',
  })
  async updateDuctWaf(
    @Param('locId') locationId: string,
    @Param('ductWafId') ductWafId: string,
    @Body() payload: DuctWafBaseDTO,
    @User() user: CurrentUser,
  ): Promise<DuctWafDTO> {
    return this.service.updateDuctWaf({
      locationId,
      ductWafId,
      payload,
      userId: user.userId,
    });
  }
}
