import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';

const KEY = 'Monitor Span';

@Injectable()
export class MonitorSpanChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentRepository: ComponentWorkspaceRepository,
  ) {}

  public throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    monitorSpan: MonitorSpanBaseDTO | MonitorSpanDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Monitor Span Checks');

    error = await this.flowFullScaleRangeCheck(monitorSpan);
    if (error) {
      errorList.push(error);
    }

    error = await this.spanScaleTransitionPointCheck(monitorSpan);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Monitor Span Checks');
    return errorList;
  }

  private async flowFullScaleRangeCheck(
    monitorSpan: MonitorSpanBaseDTO,
  ): Promise<string> {
    let error = null;
    let FIELDNAME: string = 'flowFullScaleRange';
    let componentTypeCode = monitorSpan.componentTypeCode;
    let flowFullScaleRange = monitorSpan.flowFullScaleRange;
    let flowSpanValue = monitorSpan.flowSpanValue;

    if (componentTypeCode) {
      // If the ComponentTypeCode is equal to "FLOW"
      if (componentTypeCode === 'FLOW') {
        // If the FlowFullScaleRange is null, return A
        if (flowFullScaleRange === null) {
          return this.getMessage('SPAN-17-A', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
        // If the FlowSpanValue is valid, and the FlowFullScaleRange is not greater than or equal to the FlowSpanValue, return B
        if (flowFullScaleRange <= flowSpanValue) {
          return this.getMessage('SPAN-17-B', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
      // If the ComponentTypeCode is not equal to "FLOW", and the FlowFullScaleRange is not null, return C
      if (componentTypeCode !== 'FLOW' && flowFullScaleRange !== null) {
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
  ): Promise<string> {
    let error = null;
    let FIELDNAME: string = 'flowFullScaleRange';
    let componentTypeCode = monitorSpan.componentTypeCode;
    let scaleTransitionPoint = monitorSpan.scaleTransitionPoint;

    // Monitoring Span record with a valid ComponentTypeCode equal to "HG" or "HCL"
    if (componentTypeCode === 'HG' || componentTypeCode === 'HCL') {
      // If ScaleTransitionPoint is not null
      if (scaleTransitionPoint !== null) {
        return this.getMessage('SPAN-61-A', {
          fieldname: FIELDNAME,
          condition: KEY,
        });
      }
    }
    return error;
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
