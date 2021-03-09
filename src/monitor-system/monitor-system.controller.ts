import {
    ApiTags,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
  } from '@nestjs/swagger';
  
  import {
    Get,
    Param,
    Controller,
  } from '@nestjs/common';
  
  import { MonitorSystemDTO } from '../dtos/monitor-system.dto';
  import { MonitorSystemService } from './monitor-system.service';
  
  @ApiTags('Systems')
  @Controller()
  export class MonitorSystemController {
    constructor(
      private service: MonitorSystemService,
    ) {}
  
    @Get()
    @ApiOkResponse({
      description: 'Retrieved Methods',
    })
    @ApiBadRequestResponse({
      description: 'Invalid Request',
    })
    @ApiNotFoundResponse({
      description: 'Resource Not Found',
    })
    getSystems(@Param('id') monLocId: string): Promise<MonitorSystemDTO[]> {
      return this.service.getSystems(monLocId);
    }
  }
  