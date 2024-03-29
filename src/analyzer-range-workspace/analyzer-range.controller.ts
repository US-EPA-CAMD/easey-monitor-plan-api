import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOkResponse } from '@nestjs/swagger';
import {
  AnalyzerRangeBaseDTO,
  AnalyzerRangeDTO,
} from '../dtos/analyzer-range.dto';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { AnalyzerRangeChecksService } from './analyzer-range-checks.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Analyzer Ranges')
export class AnalyzerRangeWorkspaceController {
  constructor(
    private readonly service: AnalyzerRangeWorkspaceService,
    private readonly checksService: AnalyzerRangeChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AnalyzerRangeDTO,
    description: 'Retrieves workspace Analyzer Range records for a component',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getAnalyzerRanges(
    @Param('locId') locId: string,
    @Param('compId') compId: string,
  ): Promise<AnalyzerRangeDTO[]> {
    return this.service.getAnalyzerRanges(compId);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    isArray: false,
    type: AnalyzerRangeDTO,
    description: 'Create ',
  })
  async createAnalyzerRange(
    @Param('locId') locationId: string,
    @Param('compId') componentRecordId: string,
    @Body() payload: AnalyzerRangeBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(locationId, payload, componentRecordId);
    return this.service.createAnalyzerRange(
      componentRecordId,
      payload,
      locationId,
      user.userId,
    );
  }

  @Put(':analyzerRangeId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    isArray: false,
    type: AnalyzerRangeDTO,
    description: 'Updates workspace Analyzer Range record for a component',
  })
  async updateAnalyserRange(
    @Param('locId') locationId: string,
    @Param('compId') componentRecordId: string,
    @Param('analyzerRangeId') analyzerRangeId: string,
    @Body() payload: AnalyzerRangeBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(
      locationId,
      payload,
      componentRecordId,
      false,
      true,
    );
    return this.service.updateAnalyzerRange(
      analyzerRangeId,
      payload,
      locationId,
      user.userId,
    );
  }
}
