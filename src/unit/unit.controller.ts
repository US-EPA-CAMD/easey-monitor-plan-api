import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitService } from './unit.service';
import { UnitDTO } from '../dtos/unit.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitCapacityDTO,
    description:
      'Retrieves unit records from a specific unit ID',
  })
  getUnitCapacities(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<UnitDTO[]> {
    return this.service.getUnits(locId, unitId);
  }
}
