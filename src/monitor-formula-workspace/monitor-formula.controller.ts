import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller, Put, Body, Post } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { UpdateMonitorFormulaDTO } from '../dtos/monitor-formula-update.dto';

@ApiTags('Formulas')
@Controller()
export class MonitorFormulaWorkspaceController {
  constructor(private service: MonitorFormulaWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorFormulaDTO,
    description: 'Retrieves workspace formula records for a monitor location',
  })
  getFormulas(
    @Param('locId') locationId: string,
  ): Promise<MonitorFormulaDTO[]> {
    return this.service.getFormulas(locationId);
  }

  @Post()
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Creates workspace formula record for a monitor location',
  })
  createFormula(
    @Param('locId') locationId: string,
    @Body()
    payload: UpdateMonitorFormulaDTO,
  ): Promise<MonitorFormulaDTO> {
    return this.service.createFormula(locationId, payload);
  }

  @Put(':formulaId')
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Updates workspace formula record for a monitor location',
  })
  updateFormula(
    @Param('locId') locationId: string,
    @Param('formulaId') formulaRecordId: string,
    @Body()
    payload: UpdateMonitorFormulaDTO,
  ): Promise<MonitorFormulaDTO> {
    return this.service.updateFormula(locationId, formulaRecordId, payload);
  }
}
