import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentService } from './component.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Components')
export class ComponentController {
  constructor(private service: ComponentService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ComponentDTO,
    description: 'Retrieves official component records for a monitor location',
  })
  getComponents(@Param('locId') locationId: string): Promise<ComponentDTO[]> {
    return this.service.getComponents(locationId);
  }
}
