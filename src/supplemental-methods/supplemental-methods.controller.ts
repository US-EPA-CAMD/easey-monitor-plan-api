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
  
  import { MatsMethodDataDTO } from '../dtos/mats-method-data.dto';
  import { SupplementalMethodsService } from './supplemental-methods.service';
  
  @ApiTags('Supplemental Methods')
  @Controller()
  export class SupplementalMethodsController {
    constructor(
      private service: SupplementalMethodsService,
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
    getUnits(@Param('id') monLocId: string): Promise<MatsMethodDataDTO[]> {
      return this.service.getMatsMethods(monLocId);
    }
  }
  