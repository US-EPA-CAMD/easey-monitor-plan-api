import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import {
  AnalyzerRangeBaseDTO,
  AnalyzerRangeDTO,
} from '../dtos/analyzer-range.dto';
import {
  ComponentBaseDTO,
  UpdateComponentBaseDTO,
} from '../dtos/component.dto';
import { AnalyzerRange } from '../entities/workspace/analyzer-range.entity';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';

const KEY = 'Analyzer Range';

@Injectable()
export class AnalyzerRangeChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly componentWorkspaceRespository: ComponentWorkspaceRepository,
    private readonly analyzerRangeWorkspaceRepository: AnalyzerRangeWorkspaceRepository,
  ) {}

  public throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new EaseyException(
        new Error(JSON.stringify(errorList)),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async runChecks(
    locationId: string,
    analyzerRange: AnalyzerRangeBaseDTO | AnalyzerRangeDTO,
    componentId?: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    componentData?: UpdateComponentBaseDTO,
  ) {
    let errorList: string[] = [];
    let error: string = null;
    let component: ComponentBaseDTO | UpdateComponentBaseDTO;

    if (isImport) {
      component = componentData;
    } else if (componentId) {
      component = await this.componentWorkspaceRespository.findOneBy({
        id: componentId,
      });
    }

    // COMPON-54
    if (!isUpdate) {
      error = await this.duplicateAnalyzerRangeChecks(
        component?.componentId,
        analyzerRange,
      );
    }
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
  }

  async duplicateAnalyzerRangeChecks(
    componentId: string,
    analyzerRange: AnalyzerRangeBaseDTO | AnalyzerRangeDTO,
  ): Promise<string> {
    let error: string = null;
    let record: AnalyzerRange;

    record = await this.analyzerRangeWorkspaceRepository.getAnalyzerRangeByComponentIdAndDate(
      componentId,
      analyzerRange,
    );

    if (record) {
      error = this.getMessage('COMPON-54-A', {
        recordtype: KEY,
        fieldnames: [
          'componentID',
          'beginDate',
          'beginHour',
          'endDate',
          'endHour',
        ],
      });
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
