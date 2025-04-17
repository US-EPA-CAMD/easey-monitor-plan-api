import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaService } from './monitor-formula.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseMonitorFormulaDTO = createArrayResponseDto(MonitorFormulaDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Formulas')
export class MonitorFormulaController {
  constructor(private service: MonitorFormulaService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseMonitorFormulaDTO,
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
