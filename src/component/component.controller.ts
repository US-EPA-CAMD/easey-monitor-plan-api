import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentService } from './component.service';

@ApiTags('Components')
@Controller()
export class ComponentController {
  constructor(private service: ComponentService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ComponentDTO,
    description: 'Retrieves official component records for a monitor location',
  })
  getComponents(@Param('locId') monLocId: string): Promise<ComponentDTO[]> {
    return this.service.getComponents(monLocId);
  }
}
