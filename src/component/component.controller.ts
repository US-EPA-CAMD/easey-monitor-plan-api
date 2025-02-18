import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentService } from './component.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Components')
export class ComponentController {
  constructor(private readonly service: ComponentService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ComponentDTO,
    description: 'Retrieves official component records for a monitor location',
  })
  async getComponents(@Param('locId') locationId: string): Promise<ArrayResponse<ComponentDTO>> {
    const components = await  this.service.getComponents(locationId);

    return  {
      items: components
    };
  }
}
