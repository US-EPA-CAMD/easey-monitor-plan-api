import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { UnitDTO } from '../dtos/unit.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Units')
@ApiExtraModels(UnitDTO)
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get(':id')
  @ApiOkResponse({
    description: 'Retrieves unit record for a specific unit ID',
    type: UnitDTO,
  })
  async getUnit(@Param('id') id: number): Promise<UnitDTO> {
    return this.service.getUnit(id);
  }
}
