import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';

const KEY = 'Monitor Span';

@Injectable()
export class MonitorSpanChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private readonly repository: MonitorSpanWorkspaceRepository,
  ) {}

  public throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    monitorSpan: MonitorSpanBaseDTO | MonitorSpanDTO,
    locationId: string,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Monitor Span Checks');

    error = await this.flowFullScaleRangeCheck(monitorSpan, locationId);
    if (error) {
      errorList.push(error);
    }

    error = await this.spanScaleTransitionPointCheck(monitorSpan, locationId);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Monitor Span Checks');
    return errorList;
  }

  private async flowFullScaleRangeCheck(
    monitorSpan: MonitorSpanBaseDTO,
    locationId: string,
  ): Promise<string> {
    let error = null;
    let FIELDNAME: string = 'flowFullScaleRange';
    const component = await this.repository.findOne({
      locationId: locationId,
      componentTypeCode: monitorSpan.componentTypeCode,
    });

    if (component) {
      if (component.componentTypeCode === 'FLOW') {
        if (monitorSpan.flowFullScaleRange === null) {
          return this.getMessage('SPAN-17-A', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
        if (monitorSpan.flowFullScaleRange <= monitorSpan.flowSpanValue) {
          return this.getMessage('SPAN-17-B', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }

      if (
        monitorSpan.componentTypeCode != 'FLOW' &&
        monitorSpan.flowFullScaleRange != null
      ) {
        return this.getMessage('SPAN-17-C', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    }
    return error;
  }

  private async spanScaleTransitionPointCheck(
    monitorSpan: MonitorSpanBaseDTO,
    locationId: string,
  ): Promise<string> {
    let error = null;
    let FIELDNAME: string = 'spanScaleTransitionPoint';
    const component = await this.repository.findOne({
      locationId: locationId,
      componentTypeCode: monitorSpan.componentTypeCode,
    });
    if (component) {
      if (component.componentTypeCode === 'FLOW') {
        if (monitorSpan.flowFullScaleRange === null) {
          return this.getMessage('SPAN-61-A', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
    }
    return error
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
