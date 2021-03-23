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
  
  import { ComponentDTO } from '../dtos/component.dto';
  import { ComponentService } from './component.service';
  import{AnalyzerRangeDTO} from '../dtos/analyzer-range.dto'
  
  @ApiTags('Components')
  @Controller()
  export class ComponentController {
    constructor(
      private service: ComponentService,
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
    getComponentsbyLoc(@Param('id') monLocId: string): Promise<ComponentDTO[]> {
      return this.service.getComponentsByLocation(monLocId);
    }
    @Get(":id/analyzer-range")
    @ApiOkResponse({
      description: 'Retrieved Methods',
    })
    @ApiBadRequestResponse({
      description: 'Invalid Request',
    })
    @ApiNotFoundResponse({
      description: 'Resource Not Found',
    })
    getAnalyzerRangesByComponent(@Param('id') componentId: string): Promise<AnalyzerRangeDTO[]> {
      return this.service.getAnalyzerRangesByComponent(componentId);
    }
  }
  