import { Get, Controller, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsService } from './monitor-configurations.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Configurations')
export class MonitorConfigurationsController {
  constructor(private service: MonitorConfigurationsService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description: 'Retrieves official Monitor Plan configurations',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCodes',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: false,
    explode: false,
  })
  getConfigurations(
    @Query() dto: ConfigurationMultipleParamsDTO,
  ): Promise<MonitorPlanDTO[]> {
    return this.service.getConfigurations(dto.orisCodes, dto.monPlanIds);
  }

  @Get('last-updated')
  @ApiOkResponse({
    isArray: true,
    type: MonitorPlanDTO,
    description:
      'Retrieves workspace Monitor Plan configurations that have been updated after a certain date',
  })
  getLastUpdated(
    @Query('date') queryTime: Date,
  ): Promise<LastUpdatedConfigDTO> {
    return this.service.getConfigurationsByLastUpdated(queryTime);
  }
}
