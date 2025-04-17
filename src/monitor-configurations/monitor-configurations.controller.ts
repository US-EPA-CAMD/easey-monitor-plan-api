import { Get, Controller, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { ConfigurationMultipleParamsDTO } from '../dtos/configuration-multiple-params.dto';
import { LastUpdatedConfigDTO } from '../dtos/last-updated-config.dto';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorConfigurationsService } from './monitor-configurations.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { MonitorAttributeDTO } from '../dtos/monitor-attribute.dto';

const ArrayResponseMonitorPlanDTO = createArrayResponseDto(MonitorPlanDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Configurations')
export class MonitorConfigurationsController {
  constructor(private service: MonitorConfigurationsService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseMonitorPlanDTO,
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
  async getConfigurations(
    @Query() dto: ConfigurationMultipleParamsDTO,
  ): Promise<ArrayResponse<MonitorPlanDTO>> {
    const configurations = await this.service.getConfigurations(dto.orisCodes, dto.monPlanIds);

    return  {
      items: configurations
    };
  }

  @Get('last-updated')
  @ApiOkResponse({
    type: LastUpdatedConfigDTO,
    description:
      'Retrieves workspace Monitor Plan configurations that have been updated after a certain date',
  })
  getLastUpdated(
    @Query('date') queryTime: string,
  ): Promise<LastUpdatedConfigDTO> {
    return this.service.getConfigurationsByLastUpdated(queryTime);
  }
}
