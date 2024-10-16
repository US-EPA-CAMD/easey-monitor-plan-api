import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { UnitProgramDTO } from '../dtos/unit-program.dto';
import { UnitProgramWorkspaceService } from './unit-program.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Programs')
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
  getUnitProgramsByUnitRecordId(
    @Param('unitId') unitId: number,
  ): Promise<UnitProgramDTO[]> {
    return this.service.getUnitProgramsByUnitRecordId(unitId);
  }
}
