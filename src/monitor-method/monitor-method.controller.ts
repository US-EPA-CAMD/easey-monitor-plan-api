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
  
  import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
  import { MonitorMethodService } from './monitor-method.service';
  
  @ApiTags('Monitor Methods')
  @Controller()
  export class MonitorMethodController {
    constructor(
      private service: MonitorMethodService,
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
    getUnits(@Param('id') monLocId: string): Promise<MonitorMethodDTO[]> {
      return this.service.getMonitorMethods(monLocId);
    }
  }
  