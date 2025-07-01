import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';
import { MonitorLocationService } from './monitor-location.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { UnitStackConfigurationDTO } from '../dtos/unit-stack-configuration.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Locations')
@ApiExtraModels(UnitStackConfigurationDTO)
export class MonitorLocationController {
  constructor(readonly service: MonitorLocationService) {}

  @Get(':locId')
  @ApiOkResponse({
    isArray: true,
    type: MonitorLocationDTO,
    description:
      'Retrieves official location record from a specific location ID',
  })
  getLocation(@Param('locId') locationId: string): Promise<MonitorLocationDTO> {
    return this.service.getLocation(locationId);
  }

  @Get(':locId/relationships')
  @ApiOkResponse({
    description:
      'Retrieves official relationships record for a specific location ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(UnitStackConfigurationDTO) },
              },
            },
          },
        },
      }
  })
  async getLocationRelationships(@Param('locId') locId: string
): Promise<ArrayResponse<UnitStackConfigurationDTO>> {
    const relationships = await this.service.getLocationRelationships(locId);

    return {
      items : relationships
    }
  }
}
