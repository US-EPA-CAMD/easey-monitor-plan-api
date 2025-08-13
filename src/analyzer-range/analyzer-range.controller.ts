import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Get, Param, Controller } from '@nestjs/common';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { AnalyzerRangeService } from './analyzer-range.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Analyzer Ranges')
@ApiExtraModels(AnalyzerRangeDTO)
export class AnalyzerRangeController {
  constructor(private readonly service: AnalyzerRangeService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official analyzer range records for a component',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(AnalyzerRangeDTO) },
              },
            },
          },
        },
      }
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
}
