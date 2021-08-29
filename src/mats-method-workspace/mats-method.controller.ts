import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { UpdateMatsMethodDTO } from '../dtos/mats-method-update.dto';

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
  getMethods(@Param('locId') locationId: string): Promise<MatsMethodDTO[]> {
    return this.service.getMethods(locationId);
  }

  @Post()
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Creates workspace MATS Method record',
  })
  createMethod(
    @Param('locId') locationId: string,
    @Body() payload: UpdateMatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    return this.service.createMethod(locationId, payload);
  }

  @Put(':methodId')
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Updates workspace MATS Method record',
  })
  updateMethod(
    @Param('locId') locationId: string,
    @Param('methodId') methodId: string,
    @Body() payload: UpdateMatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    return this.service.updateMethod(methodId, locationId, payload);
  }
}
