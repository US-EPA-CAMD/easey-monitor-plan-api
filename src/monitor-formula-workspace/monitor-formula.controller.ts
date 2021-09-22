import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Put,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { UpdateMonitorFormulaDTO } from '../dtos/monitor-formula-update.dto';
import CurrentUser from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

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
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Creates workspace formula record for a monitor location',
  })
  createFormula(
    @Param('locId') locationId: string,
    @CurrentUser() userId: string,
    @Body()
    payload: UpdateMonitorFormulaDTO,
  ): Promise<MonitorFormulaDTO> {
    return this.service.createFormula(locationId, userId, payload);
  }

  @Put('formulaId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Updates workspace formula record for a monitor location',
  })
  updateFormula(
    @Param('locId') locationId: string,
    @Param('formulaId') formularRecordId: string,
    @CurrentUser() userId: string,
    @Body()
    payload: UpdateMonitorFormulaDTO,
  ): Promise<MonitorFormulaDTO> {
    return this.service.updateFormula(
      locationId,
      formularRecordId,
      userId,
      payload,
    );
  }
}
