import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentService } from './component.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Components')
@ApiExtraModels(ComponentDTO)
export class ComponentController {
  constructor(private readonly service: ComponentService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official component records for a monitor location',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(ComponentDTO) },
              },
            },
          },
        },
      }
  })
  async getComponents(@Param('locId') locationId: string): Promise<ArrayResponse<ComponentDTO>> {
    const components = await  this.service.getComponents(locationId);

    return  {
      items: components
    };
  }
}
