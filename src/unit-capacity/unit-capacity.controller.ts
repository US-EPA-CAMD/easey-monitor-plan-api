import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityService } from './unit-capacity.service';

@ApiTags('Unit Capacities')
@Controller()
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
    @Param('unitRecordId') unitRecordId: number,
  ): Promise<UnitCapacityDTO[]> {
    return this.service.getUnitCapacities(locId, unitRecordId);
  }
}
