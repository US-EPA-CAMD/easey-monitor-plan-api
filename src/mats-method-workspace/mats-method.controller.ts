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

import { MatsMethodWorkspaceService } from './mats-method.service';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Methods')
export class MatsMethodWorkspaceController {
  constructor(
    private readonly service: MatsMethodWorkspaceService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MatsMethodDTO,
    description:
      'Retrieves workspace copy MATS Method records for a monitor location',
  })
  getMethods(@Param('locId') locationId: string): Promise<MatsMethodDTO[]> {
    return this.service.getMethods(locationId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Creates workspace MATS Method record',
  })
  createMethod(
    @Param('locId') locationId: string,
    @Body() payload: MatsMethodBaseDTO,
    @CurrentUser() userId: string,
  ): Promise<MatsMethodDTO> {
    this.logger.info('Creating method', {
      locationId: locationId,
      payload: payload,
      userId: userId,
    });
    return this.service.createMethod(locationId, payload, userId);
  }

  @Put(':methodId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MatsMethodDTO,
    description: 'Updates workspace MATS Method record',
  })
  updateMethod(
    @Param('locId') locationId: string,
    @Param('methodId') methodId: string,
    @CurrentUser() userId: string,
    @Body() payload: MatsMethodBaseDTO,
  ): Promise<MatsMethodDTO> {
    this.logger.info('Updating method', {
      locationId: locationId,
      methodId: methodId,
      payload: payload,
      userId: userId,
    });
    return this.service.updateMethod(methodId, locationId, payload, userId);
  }
}
