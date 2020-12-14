import {
    ApiTags,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
  } from '@nestjs/swagger';
  
  import {
    Get,
    Query,
    Param,
    Controller,
    ParseIntPipe,
    ValidationPipe,
  } from '@nestjs/common';
  
  import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
  import { MonitoringMethodService } from './monitoring-method.service';
  
  @ApiTags('MonitoringMethods')
  @Controller()
  export class MonitoringMethodController {
    constructor(
      private service: MonitoringMethodService,
    ) {}
  
    @Get('')
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
      return this.service.getMonitoringMethods(monLocId);
    }
  
    
  }
  