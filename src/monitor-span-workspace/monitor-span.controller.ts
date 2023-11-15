import { ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Get, Param, Controller, Post, Put, Body } from '@nestjs/common';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { MonitorSpanWorkspaceService } from './monitor-span.service';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanChecksService } from './monitor-span-checks.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Spans')
export class MonitorSpanWorkspaceController {
  constructor(
    private service: MonitorSpanWorkspaceService,
    private checksService: MonitorSpanChecksService,
  ) {}

  @Get()
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Retrieves workspace span records for a monitor location',
  })
  getSpans(@Param('locId') locationId: string): Promise<MonitorSpanDTO[]> {
    return this.service.getSpans(locationId);
  }

  @Put(':spanId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: MonitorSpanDTO,
    description: 'Updates a workspace span record for a monitor location',
  })
  async updateSpan(
    @Param('locId') locationId: string,
    @Param('spanId') spanId: string,
    @Body() payload: MonitorSpanBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSpanDTO> {
    await this.checksService.runChecks(payload, locationId);
    return this.service.updateSpan(locationId, spanId, payload, user.userId);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP', 'DPMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    isArray: true,
    type: MonitorSpanDTO,
    description: 'Creates a workspace span record for a monitor location',
  })
  async createSpan(
    @Param('locId') locationId: string,
    @Body() payload: MonitorSpanBaseDTO,
    @User() user: CurrentUser,
  ): Promise<MonitorSpanDTO> {
    await this.checksService.runChecks(payload, locationId, false, true);
    return this.service.createSpan(locationId, payload, user.userId);
  }
}
