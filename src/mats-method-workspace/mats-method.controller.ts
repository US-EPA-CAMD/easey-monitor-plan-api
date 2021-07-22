import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MatsMethodService } from './mats-method.service';
import { MatsMethodDTO } from '../dtos/mats-method.dto';

@ApiTags('MATS Methods')
@Controller()
export class MatsMethodController {
  constructor(private service: MatsMethodService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MatsMethodDTO,
    description:
      'Retrieves workspace copy MATS Method records for a monitor location',
  })
  getMethods(@Param('locId') monLocId: string): Promise<MatsMethodDTO[]> {
    return this.service.getMethods(monLocId);
  }
}
