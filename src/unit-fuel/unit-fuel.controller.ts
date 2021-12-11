import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

import { UnitFuelService } from './unit-fuel.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Fuels')
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
    @Param('unitId') unitId: number,
  ): Promise<UnitFuelDTO[]> {
    return this.service.getUnitFuels(locId, unitId);
  }
}
