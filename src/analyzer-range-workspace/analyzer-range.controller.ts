import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOkResponse } from '@nestjs/swagger';
import {
  AnalyzerRangeBaseDTO,
  AnalyzerRangeDTO,
} from '../dtos/analyzer-range.dto';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { AnalyzerRangeChecksService } from './analyzer-range-checks.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse, createArrayResponseDto } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';

const ArrayResponseAnalyzerRangeDTO = createArrayResponseDto(AnalyzerRangeDTO);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Analyzer Ranges')
@ApiExcludeControllerByEnv()
export class AnalyzerRangeWorkspaceController {
  constructor(
    private readonly service: AnalyzerRangeWorkspaceService,
    private readonly checksService: AnalyzerRangeChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ArrayResponseAnalyzerRangeDTO,
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
  @AuditLog({
    label: 'Retrieved workspace monitor location component analyzer range records',
    requestParamsOutFields: ['locId', 'compId']
  })
  async getAnalyzerRanges(
    @Param('locId') locId: string,
    @Param('compId') compId: string,
  ): Promise<ArrayResponse<AnalyzerRangeDTO>> {
    const analyzerRanges = await this.service.getAnalyzerRanges(compId);

    return  {
      items: analyzerRanges
    };
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Created workspace monitor location component analyzer range record',
    requestParamsOutFields: ['locId', 'compId'],
    responseBodyOutFields: '*'
  })
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
    return this.service.createAnalyzerRange({
      componentRecordId,
      payload,
      locationId,
      userId: user.userId,
    });
  }

  @Put(':analyzerRangeId')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSMP'],
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Updated workspace monitor location component analyzer range record',
    requestParamsOutFields: ['locId', 'compId', 'analyzerRangeId'],
    responseBodyOutFields: '*'
  })
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
    return this.service.updateAnalyzerRange({
      analyzerRangeId,
      payload,
      locationId,
      userId: user.userId,
    });
  }
}
