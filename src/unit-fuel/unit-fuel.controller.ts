import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitFuelDTO } from '../dtos/unit-fuel.dto';

import { UnitFuelService } from './unit-fuel.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseUnitFuelDTO = createArrayResponseDto(UnitFuelDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Fuels')
export class UnitFuelController {
  constructor(private readonly service: UnitFuelService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseUnitFuelDTO,
    description: 'Retrieves official unit fuel records from a specific unit ID',
  })
  async getUnitFuels(
    @Param('locId') locId: string,
    @Param('unitId') unitId: number,
  ): Promise<ArrayResponse<UnitFuelDTO>> {
    const unitFuels = await this.service.getUnitFuels(locId, unitId);

    return  {
      items: unitFuels
    }
  }
}
