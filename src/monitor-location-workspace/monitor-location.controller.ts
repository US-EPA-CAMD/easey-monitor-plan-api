import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationWorkspaceService } from './monitor-location.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Locations')
@ApiExcludeControllerByEnv()
export class MonitorLocationWorkspaceController {
  constructor(readonly service: MonitorLocationWorkspaceService) {}

  @Get(':locId')
  @ApiOkResponse({
    isArray: true,
    type: MonitorLocationDTO,
    description:
      'Retrieves workspace location record from specific location ID',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace location data',
    requestParamsOutFields:['locId'],
    responseBodyOutFields:['unitId', 'stackPipeId']
  })
  getLocation(@Param('locId') locationId: string): Promise<MonitorLocationDTO> {
    return this.service.getLocation(locationId);
  }

  @Get(':locId/relationships')
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved workspace relationship data',
    requestParamsOutFields:['locId']
  })
  async getLocationRelationships(@Param('locId') locId: string) {
    return this.service.getLocationRelationships(locId);
  }
}
