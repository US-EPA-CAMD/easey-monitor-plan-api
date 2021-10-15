import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { DuctWafService } from './duct-waf.service';
import { DuctWafDTO } from '../dtos/duct-waf.dto';

@ApiTags('Rectangular Duct WAF')
@Controller()
export class DuctWafController {
  constructor(private readonly service: DuctWafService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: DuctWafDTO,
    description: 'Retrieves official duct waf records for a monitor location',
  })
  getDuctWafs(@Param('locId') locationId: string): Promise<DuctWafDTO[]> {
    return this.service.getDuctWafs(locationId);
  }
}
