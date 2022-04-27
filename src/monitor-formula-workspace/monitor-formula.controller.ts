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

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaWorkspaceService } from './monitor-formula.service';
import { MonitorFormulaBaseDTO } from '../dtos/monitor-formula.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Formulas')
export class MonitorFormulaWorkspaceController {
  constructor(
    private readonly service: MonitorFormulaWorkspaceService,
    private readonly logger: Logger,
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
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Creates workspace formula record for a monitor location',
  })
  createFormula(
    @Param('locId') locationId: string,
    @Body()
    payload: MonitorFormulaBaseDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorFormulaDTO> {
    this.logger.info('Creating Formula', {
      locationId,
      payload,
      userId,
    });
    return this.service.createFormula(locationId, payload, userId);
  }

  @Put(':formulaId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorFormulaDTO,
    description: 'Updates workspace formula record for a monitor location',
  })
  updateFormula(
    @Param('locId') locationId: string,
    @Param('formulaId') formulaRecordId: string,
    @Body()
    payload: MonitorFormulaBaseDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorFormulaDTO> {
    this.logger.info('Updating Formula', {
      locationId,
      formulaRecordId,
      payload,
      userId,
    });
    return this.service.updateFormula(
      locationId,
      formulaRecordId,
      payload,
      userId,
    );
  }
}
