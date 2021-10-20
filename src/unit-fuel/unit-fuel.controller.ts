import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

import { UnitFuelService } from './unit-fuel.service';

@ApiTags('Unit Fuels')
@Controller()
export class UnitFuelController {
  constructor(private readonly service: UnitFuelService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitFuelDTO,
    description: 'Retrieves official unit fuel records from a specific unit ID',
  })
  getUnitFuels(
    @Param('locId') locId: string,
    @Param('unitRecordId') unitRecordId: number,
  ): Promise<UnitFuelDTO[]> {
    return this.service.getUnitFuels(locId, unitRecordId);
  }
}
