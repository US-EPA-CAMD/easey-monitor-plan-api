import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

import { UnitProgramService } from './unit-program.service';
import { UnitProgramDTO } from '../dtos/unit-program.dto';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseUnitProgramDTO = createArrayResponseDto(UnitProgramDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Programs')
export class UnitProgramController {
  constructor(private readonly service: UnitProgramService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseUnitProgramDTO,
    description: 'Retrieves unit control records from a specific unit ID',
  })
  async getUnitProgramsByUnitRecordId(
    @Param('unitId') unitRecordId: number,
  ): Promise<ArrayResponse<UnitProgramDTO>> {
    const unitProgramDTOS = await this.service.getUnitProgramsByUnitRecordId(unitRecordId);

    return  {
      items: unitProgramDTOS
    }
  }
}
