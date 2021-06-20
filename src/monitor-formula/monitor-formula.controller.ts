import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Get, Param, Controller } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaService } from './monitor-formula.service';

@ApiTags('Monitor Formulas')
@Controller()
export class MonitorFormulaController {
  constructor(private service: MonitorFormulaService) {}

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
  getFormulas(@Param('id') monLocId: string): Promise<MonitorFormulaDTO[]> {
    return this.service.getMonitorFormulas(monLocId);
  }
}
