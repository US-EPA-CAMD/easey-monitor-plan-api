import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UnitControlDTO } from '../dtos/unit-control.dto';

import { UnitControlWorkspaceService } from './unit-control.service';

@ApiTags('Unit Controls')
@Controller()
export class UnitControlWorkspaceController {
  constructor(private readonly service: UnitControlWorkspaceService) {}

  @Get(':unitId')
  @ApiOkResponse({
    isArray: true,
    type: UnitControlDTO,
    description: 'Retrieves official load records for a monitor location',
  })
  getUnitControls(@Param('unitId') unitId: number): Promise<UnitControlDTO[]> {
    return this.service.getUnitControls(unitId);
  }
}
