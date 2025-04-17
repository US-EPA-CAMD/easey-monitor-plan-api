import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { DuctWafService } from './duct-waf.service';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseDuctWafDTO = createArrayResponseDto(DuctWafDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rectangular Duct WAF')
export class DuctWafController {
  constructor(private readonly service: DuctWafService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseDuctWafDTO,
    description: 'Retrieves official duct waf records for a monitor location',
  })
  async getDuctWafs(@Param('locId') locationId: string): Promise<ArrayResponse<DuctWafDTO>> {
    const ductWafs = await this.service.getDuctWafs(locationId);

    return  {
      items: ductWafs
    };
  }
}
