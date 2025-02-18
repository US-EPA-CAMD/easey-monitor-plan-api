import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaService } from './monitor-formula.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

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
  async getFormulas(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<MonitorFormulaDTO>> {
    const formulas = await this.service.getFormulas(locationId);

    return  {
      items: formulas
    };
  }
}
