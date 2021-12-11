import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaService } from './monitor-formula.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Formulas')
export class MonitorFormulaController {
  constructor(private service: MonitorFormulaService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorFormulaDTO,
    description: 'Retrieves official formula records for a monitor location',
  })
  getFormulas(
    @Param('locId') locationId: string,
  ): Promise<MonitorFormulaDTO[]> {
    return this.service.getFormulas(locationId);
  }
}
