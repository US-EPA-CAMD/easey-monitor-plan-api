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
  ApiSecurity,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnalyzerRangeBaseDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { CurrentUser } from '@us-epa-camd/easey-common/decorators/current-user.decorator';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Analyzer Ranges')
export class AnalyzerRangeWorkspaceController {
  constructor(
    private readonly service: AnalyzerRangeWorkspaceService,
    private readonly logger: Logger,
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
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: false,
    type: AnalyzerRangeDTO,
    description: 'Create ',
  })
  createAnalyzerRange(
    @Param('locId') locationId: string,
    @Param('compId') componentRecordId: string,
    @CurrentUser() userId: string,
    @Body() payload: AnalyzerRangeBaseDTO,
  ) {
    this.logger.info('Creating analyzer range', {
      userId: userId,
      componentRecordId: componentRecordId,
      payload: payload,
    });
    return this.service.createAnalyzerRange(
      componentRecordId,
      payload,
      locationId,
      userId,
    );
  }

  @Put(':analyzerRangeId')
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    isArray: false,
    type: AnalyzerRangeDTO,
    description: 'Updates workspace Analyzer Range record for a component',
  })
  updateAnalyserRange(
    @Param('locId') locationId: string,
    @Param('compId') componentRecordId: string,
    @Param('analyzerRangeId') analyzerRangeId: string,
    @CurrentUser() userId: string,
    @Body() payload: AnalyzerRangeBaseDTO,
  ) {
    this.logger.info('Updating analyzer range', {
      userId: userId,
      analyzerRangeId: analyzerRangeId,
      payload: payload,
    });
    return this.service.updateAnalyzerRange(
      analyzerRangeId,
      payload,
      locationId,
      userId,
    );
  }
}
