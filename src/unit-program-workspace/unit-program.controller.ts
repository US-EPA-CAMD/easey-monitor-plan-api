import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
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
@ApiExtraModels(UnitProgramDTO)
export class UnitProgramWorkspaceController {
  constructor(private readonly service: UnitProgramWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace unit control records from a specific unit ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitProgramDTO) },
              },
            },
          },
        },
      }
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'unitId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Unit,
  )
  @AuditLog({
    label: 'Retrieved workspace monitor location unit programs',
    requestParamsOutFields: ['unitId'],
  })
  async getUnitProgramsByUnitRecordId(
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitProgramDTO>> {
    const unitProgramDTOS =
      await this.service.getUnitProgramsByUnitRecordId(unitId);

    return { items: unitProgramDTOS };
  }
}
