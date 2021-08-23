import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { SystemComponentService } from './system-component.service';
import { SystemComponentDTO } from '../dtos/system-component.dto';

@ApiTags('System Components')
@Controller()
export class SystemComponentController {
  constructor(private service: SystemComponentService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: SystemComponentDTO,
    description: 'Retrieves official component records for a monitor system',
  })
  getComponents(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<SystemComponentDTO[]> {
    return this.service.getComponents(locationId, monSysId);
  }
}
