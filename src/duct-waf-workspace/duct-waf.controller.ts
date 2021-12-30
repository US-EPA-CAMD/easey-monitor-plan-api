import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { UpdateDuctWafDTO } from '../dtos/duct-waf-update.dto';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafWorkspaceService } from './duct-waf.service';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rectangular Duct WAF')
export class DuctWafWorkspaceController {
  constructor(
    private readonly service: DuctWafWorkspaceService,
    private readonly logger: Logger,
  ) {}

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
    this.Logger.info('Creating duct waf', {
      locationId: locationId,
      payload: payload,
      userId: userId,
    });
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
    this.Logger.info('Updating duct waf', {
      locationId: locationId,
      payload: payload,
      ductWafId: ductWafId,
      userId: userId,
    });
    return this.service.updateDuctWaf(locationId, ductWafId, payload, userId);
  }
}
