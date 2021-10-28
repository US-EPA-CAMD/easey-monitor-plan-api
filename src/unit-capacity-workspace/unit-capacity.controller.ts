import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UnitCapacityDTO } from '../dtos/unit-capacity.dto';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';

@ApiTags('Unit Capacity')
@Controller()
export class UnitCapacityWorkspaceController {
  constructor(private readonly service: UnitCapacityWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitCapacityDTO,
    description: 'Retrieves workspace',
  })
  getUnitCapacities() {
    return 'asdf';
  }
}
