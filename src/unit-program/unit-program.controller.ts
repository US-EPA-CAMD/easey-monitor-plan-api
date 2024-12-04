import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { AuditLog } from '@us-epa-camd/easey-common/decorators';

import { UnitProgramService } from './unit-program.service';
import { UnitProgramDTO } from '../dtos/unit-program.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Programs')
export class UnitProgramController {
  constructor(private readonly service: UnitProgramService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitProgramDTO,
    description: 'Retrieves unit control records from a specific unit ID',
  })
  @AuditLog({
    label: 'Retrieved monitor location unit programs',
    requestParamsOutFields: ['unitId']
  })
  getUnitProgramsByUnitRecordId(
    @Param('unitId') unitRecordId: number,
  ): Promise<UnitProgramDTO[]> {
    return this.service.getUnitProgramsByUnitRecordId(unitRecordId);
  }
}
