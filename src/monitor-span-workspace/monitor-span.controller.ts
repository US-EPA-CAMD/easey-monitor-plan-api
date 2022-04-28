import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  Get,
  Param,
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators';
import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Spans')
export class MonitorSpanWorkspaceController {
  constructor(private service: MonitorSpanWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Retrieves workspace span records for a monitor location',
  })
  getSpans(@Param('locId') locationId: string): Promise<MonitorSpanDTO[]> {
    return this.service.getSpans(locationId);
  }

  @Put(':spanId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: MonitorSpanDTO,
    description: 'Updates a workspace span record for a monitor location',
  })
  async updateSpan(
    @Param('locId') locationId: string,
    @Param('spanId') spanId: string,
    @Body() payload: MonitorSpanBaseDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorSpanDTO> {
    return this.service.updateSpan(locationId, spanId, payload, userId);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Creates a workspace span record for a monitor location',
  })
  createSpan(
    @Param('locId') locationId: string,
    @Body() payload: MonitorSpanBaseDTO,
    @CurrentUser() userId: string,
  ): Promise<MonitorSpanDTO> {
    return this.service.createSpan(locationId, payload, userId);
  }
}
