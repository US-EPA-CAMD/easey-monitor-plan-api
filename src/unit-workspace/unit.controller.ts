import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { UnitDTO } from '../dtos/unit.dto';
import { UnitWorkspaceService } from './unit.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Units')
export class UnitWorkspaceController {
  constructor(private readonly service: UnitWorkspaceService) {}

  @Get(':facId')
  @ApiOkResponse({
    isArray: true,
    type: UnitDTO,
    description: 'Retrieves a list of units by facility ID',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'facId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  getUnitsByFacId(@Param('facId') facId: number) {
    return this.service.getUnitsByFacId(facId);
  }
}
