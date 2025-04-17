import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { SystemComponentService } from './system-component.service';
import { SystemComponentDTO } from '../dtos/system-component.dto';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';

const ArrayResponseSystemComponentDTO = createArrayResponseDto(SystemComponentDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('System Components')
export class SystemComponentController {
  constructor(private service: SystemComponentService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseSystemComponentDTO,
    description: 'Retrieves official component records for a monitor system',
  })
  async getComponents(
    @Param('locId') locationId: string,
    @Param('sysId') monSysId: string,
  ): Promise<ArrayResponse<SystemComponentDTO>> {
    const components = await this.service.getComponents(locationId, monSysId);

    return  {
      items: components
    }
  }
}
