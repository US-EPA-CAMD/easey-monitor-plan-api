import { Controller, Get, Query, Req, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { UnitDTO } from '../dtos/unit.dto';
import { UnitParamsDTO } from '../dtos/unit.params.dto';
import { UnitWorkspaceService } from './unit.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Units')
export class UnitWorkspaceController {
  constructor(private readonly service: UnitWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitDTO,
    description: 'Retrieves a list of units',
  })
  getComponents(
    @Query(ValidationPipe) unitParamsDTO: UnitParamsDTO,
    @Req() req: Request,
  ) {
    return this.service.getUnits(unitParamsDTO, req);
  }
}
