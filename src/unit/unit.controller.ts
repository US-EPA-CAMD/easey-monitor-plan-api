import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { UnitDTO } from '../dtos/unit.dto';

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
  getUnits(@Param('id') id: number): Promise<UnitDTO[]> {
    return this.service.getUnits(id);
  }
}
