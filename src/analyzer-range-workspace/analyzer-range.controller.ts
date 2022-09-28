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
  ApiTags,
  ApiSecurity,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  AnalyzerRangeBaseDTO,
  AnalyzerRangeDTO,
} from '../dtos/analyzer-range.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Analyzer Ranges')
export class AnalyzerRangeWorkspaceController {
  constructor(
    private readonly service: AnalyzerRangeWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AnalyzerRangeDTO,
    description: 'Retrieves workspace Analyzer Range records for a component',
  })
  getAnalyzerRanges(
    @Param('locId') locId: string,
    @Param('compId') compId: string,
  ): Promise<AnalyzerRangeDTO[]> {
    return this.service.getAnalyzerRanges(compId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    isArray: false,
    type: AnalyzerRangeDTO,
    description: 'Create ',
  })
  createAnalyzerRange(
    @Param('locId') locationId: string,
    @Param('compId') componentRecordId: string,
    @Body() payload: AnalyzerRangeBaseDTO,
    @User() user: CurrentUser,
  ) {
    return this.service.createAnalyzerRange(
      componentRecordId,
      payload,
      locationId,
      user.userId,
    );
  }

  @Put(':analyzerRangeId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    isArray: false,
    type: AnalyzerRangeDTO,
    description: 'Updates workspace Analyzer Range record for a component',
  })
  updateAnalyserRange(
    @Param('locId') locationId: string,
    @Param('compId') componentRecordId: string,
    @Param('analyzerRangeId') analyzerRangeId: string,
    @Body() payload: AnalyzerRangeBaseDTO,
    @User() user: CurrentUser,
  ) {
    return this.service.updateAnalyzerRange(
      analyzerRangeId,
      payload,
      locationId,
      user.userId,
    );
  }
}
