import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodService } from './mats-method.service';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';

const ArrayResponseMatsMethodDTO = createArrayResponseDto(MatsMethodDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Methods')
export class MatsMethodController {
  constructor(private readonly service: MatsMethodService) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseMatsMethodDTO,
    description:
      'Retrieves official MATS Method records for a monitor location',
  })
  async getMethods(@Param('locId') locationId: string): Promise<ArrayResponse<MatsMethodDTO>> {
    const methods = await this.service.getMethods(locationId);

    return  {
      items: methods
    };
  }
}
