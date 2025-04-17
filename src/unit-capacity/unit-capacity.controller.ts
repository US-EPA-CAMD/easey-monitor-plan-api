import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityService } from './unit-capacity.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseUnitCapacityDTO = createArrayResponseDto(UnitCapacityDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Capacities')
export class UnitCapacityController {
  constructor(private readonly service: UnitCapacityService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseUnitCapacityDTO,
    description:
      'Retrieves workspace unit capacity records from a specific unit ID',
  })
  async getUnitCapacities(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitCapacityDTO>> {
    const unitCapacityDTOS = await this.service.getUnitCapacities(locId, unitId);

    return  {
      items: unitCapacityDTOS
    }
  }
}
