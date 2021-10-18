import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';
import { UpdateDuctWafDTO } from '../dtos/duct-waf-update.dto';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafWorkspaceService } from './duct-waf.service';
import CurrentUser from '../decorators/current-user.decorator';

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

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: DuctWafDTO,
    description: 'Create a workspace duct waf record for a monitor location',
  })
  async createDuctWaf(
    @Param('locId') locationId: string,
    @Body() payload: UpdateDuctWafDTO,
    @CurrentUser() userId: string,
  ): Promise<DuctWafDTO> {
    return this.service.createDuctWaf(locationId, payload, userId);
  }

  @Put(':ductWafId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: DuctWafDTO,
    description: 'Updates a workspace duct waf record for a monitor location',
  })
  async updateDuctWaf(
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
