import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { SystemComponentService } from './system-component.service';
import { SystemComponentDTO } from '../dtos/system-component.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Components')
@ApiExtraModels(SystemComponentDTO)
export class SystemComponentController {
  constructor(private service: SystemComponentService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official component records for a monitor system',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(SystemComponentDTO) },
              },
            },
          },
        },
      }
  })
  async getComponents(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<ArrayResponse<SystemComponentDTO>> {
    const components = await this.service.getComponents(locationId, monSysId);

    return  {
      items: components
    }
  }
}
