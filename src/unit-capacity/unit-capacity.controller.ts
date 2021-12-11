import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityService } from './unit-capacity.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Capacities')
export class UnitCapacityController {
  constructor(private readonly service: UnitCapacityService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitCapacityDTO,
    description:
      'Retrieves workspace unit capacity records from a specific unit ID',
  })
  getUnitCapacities(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<UnitCapacityDTO[]> {
    return this.service.getUnitCapacities(locId, unitId);
  }
}
