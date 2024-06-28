import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { UnitDTO } from '../dtos/unit.dto';
import { UnitService } from './unit.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Units')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get(':facId')
  @ApiOkResponse({
    isArray: true,
    type: UnitDTO,
    description: 'Retrieves a list of units by facility ID',
  })
  getUnitsByFacId(@Param('facId') facId: number) {
    return this.service.getUnitsByFacId(facId);
  }
}
