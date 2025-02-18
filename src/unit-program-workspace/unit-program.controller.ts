import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { UnitProgramDTO } from '../dtos/unit-program.dto';
import { UnitProgramWorkspaceService } from './unit-program.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Programs')
@ApiExcludeControllerByEnv()
export class UnitProgramWorkspaceController {
  constructor(private readonly service: UnitProgramWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitProgramDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
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
    label: 'Retrieved workspace monitor location unit programs',
    requestParamsOutFields: ['unitId']
  })
  async getUnitProgramsByUnitRecordId(
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitProgramDTO>> {
    const unitProgramDTOS = await this.service.getUnitProgramsByUnitRecordId(unitId);

    return  {
      items: unitProgramDTOS
    }
  }
}
