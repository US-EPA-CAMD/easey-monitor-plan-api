import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Put,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import {
  MonitorFormulaBaseDTO,
  MonitorFormulaDTO,
} from '../dtos/monitor-formula.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Formulas')
export class MonitorFormulaWorkspaceController {
  constructor(
    private readonly service: MonitorFormulaWorkspaceService,
  ) {}

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Creates workspace formula record for a monitor location',
  })
  createFormula(
    @Param('locId') locationId: string,
    @Body() payload: MonitorFormulaBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorFormulaDTO> {
    return this.service.createFormula(locationId, payload, user.userId);
  }

  @Put(':formulaId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Updates workspace formula record for a monitor location',
  })
  updateFormula(
    @Param('locId') locationId: string,
    @Param('formulaId') formulaRecordId: string,
    @Body() payload: MonitorFormulaBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorFormulaDTO> {
    return this.service.updateFormula(
      locationId,
      formulaRecordId,
      payload,
      user.userId,
    );
  }
}
