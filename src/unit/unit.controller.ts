import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { UnitDTO } from '../dtos/unit.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get(':id')
  @ApiOkResponse({
    isArray: true,
    type: UnitDTO,
    description: 'Retrieves unit records from a specific unit ID',
  })
  async getUnits(@Param('id') id: number): Promise<ArrayResponse<UnitDTO>> {
    const units = await this.service.getUnits(id);

    return  {
      items: units
    };
  }
}
