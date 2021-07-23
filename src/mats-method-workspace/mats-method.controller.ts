import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodDTO } from '../dtos/mats-method.dto';

@ApiTags('MATS Methods')
@Controller()
export class MatsMethodWorkspaceController {
  constructor(private service: MatsMethodWorkspaceService) {}

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

  @Post()
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Creates workspace MATS Method record',
  })
  createMethod(
    @Param('locId') monLocId: string,
    @Body() payload: MatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    return this.service.createMethod(monLocId, payload);
  }

  @Put(':methodId')
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Updates workspace MATS Method record',
  })
  updateMethod(
    @Param('locId') locId: string,
    @Param('methodId') methodId: string,
    @Body() payload: MatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    return this.service.updateMethod(methodId, payload);
  }
}
