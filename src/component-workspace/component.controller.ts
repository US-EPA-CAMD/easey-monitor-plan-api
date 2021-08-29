import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentWorkspaceService } from './component.service';

@ApiTags('Components')
@Controller()
export class ComponentWorkspaceController {
  constructor(private service: ComponentWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ComponentDTO,
    description: 'Retrieves workspace component records for a monitor location',
  })
  getComponents(@Param('locId') locationId: string): Promise<ComponentDTO[]> {
    return this.service.getComponents(locationId);
  }
}
