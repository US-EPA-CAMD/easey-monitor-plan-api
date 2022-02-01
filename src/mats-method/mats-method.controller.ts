import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodService } from './mats-method.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Methods')
export class MatsMethodController {
  constructor(private readonly service: MatsMethodService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MatsMethodDTO,
    description:
      'Retrieves official MATS Method records for a monitor location',
  })
  getMethods(@Param('locId') locationId: string): Promise<MatsMethodDTO[]> {
    return this.service.getMethods(locationId);
  }
}
