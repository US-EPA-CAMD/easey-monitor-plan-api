import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';
import { UpdateDuctWafDTO } from '../dtos/duct-waf-update.dto';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafWorkspaceService } from './duct-waf.service';
import CurrentUser from 'src/decorators/current-user.decorator';

@ApiTags('Rectangular Duct WAF')
@Controller()
export class DuctWafWorkspaceController {
  constructor(private readonly service: DuctWafWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: DuctWafDTO,
    description: 'Retrieves workspace duct waf records for a monitor location',
  })
  getDuctWafs(@Param('locId') locationId: string): Promise<DuctWafDTO[]> {
    return this.service.getDuctWafs(locationId);
  }

  @Put(':ductWafId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: DuctWafDTO,
    description: 'Updates a workspace duct waf record for a monitor location',
  })
  async updateDuctWat(
    @Param('locId') locationId: string,
    @Param('ductWafId') ductWafId: string,
    @Body() payload: UpdateDuctWafDTO,
    @CurrentUser() userId: string,
  ): Promise<DuctWafDTO> {
    return await this.service.updateDuctWaf(
      locationId,
      ductWafId,
      payload,
      userId,
    );
  }
}
