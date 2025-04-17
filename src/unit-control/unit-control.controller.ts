import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitControlDTO } from '../dtos/unit-control.dto';

import { UnitControlService } from './unit-control.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseUnitControlDTO = createArrayResponseDto(UnitControlDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Controls')
export class UnitControlController {
  constructor(private readonly service: UnitControlService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseUnitControlDTO,
    description:
      'Retrieves workspace unit control records from a specific unit ID',
  })
  async getUnitControls(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitControlDTO>> {
    const unitCapacityDTOS = await this.service.getUnitControls(locId, unitId);

    return  {
      items: unitCapacityDTOS
    }
  }
}
