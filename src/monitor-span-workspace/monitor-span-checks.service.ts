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
    locationId: string,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Monitor Span Checks');

    error = await this.flowFullScaleRangeCheck(monitorSpan, locationId);
    if (error) {
      errorList.push(error);
    }

    error = await this.highSpanScaleTransitionPointCheck(
      monitorSpan,
      locationId,
    );
    if (error) {
      errorList.push(error);
    }

    error = await this.lowSpanScaleTransitionPointCheck(
      monitorSpan,
      locationId,
    );
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
    const record = await this.componentRepository.findOne({
      locationId: locationId,
      componentTypeCode: monitorSpan.componentTypeCode,
    });

    if (record) {
      if (record.componentTypeCode === 'FLOW') {
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

  private async highSpanScaleTransitionPointCheck(
    monitorSpan: MonitorSpanBaseDTO,
    locationId: string,
  ): Promise<string> {
    let error = null;
    let spanScale = monitorSpan.spanScaleCode;
    const record = await this.componentRepository.findOne({
      locationId: locationId,
      componentTypeCode: monitorSpan.componentTypeCode,
    });

    // Monitoring Span record with a valid ComponentTypeCode and a SpanScale equal to "H"
    if (record && spanScale != 'H') {
      // If ScaleTransitionPoint is not null
      if (monitorSpan.scaleTransitionPoint != null) {
        // If SpanValue is null and DefaultHighRangeValue is not null, return A
        if (
          monitorSpan.spanValue === null &&
          monitorSpan.defaultHighRange != null
        ) {
          return this.getMessage('SPAN-58-A', {
            key: KEY,
          });
        }
      }
    }
    return error
  }
  private async lowSpanScaleTransitionPointCheck(
    monitorSpan: MonitorSpanBaseDTO,
    locationId: string,
  ): Promise<string> {
    let error = null;
    let spanScale = monitorSpan.spanScaleCode;
    let scaleTransitionPoint = monitorSpan.scaleTransitionPoint;
    let fullScaleRange = monitorSpan.fullScaleRange;
    const component = await this.componentRepository.findOne({
      locationId: locationId,
      componentTypeCode: monitorSpan.componentTypeCode,
    });

    // Monitoring Span record with a valid ComponentTypeCode and a SpanScale equal to "L"
    if (component && spanScale != 'L') {
      // If ScaleTransitionPoint is not null
      if (scaleTransitionPoint != null) {
        // If FullScaleRangeValue is not null, and the ScaleTransitionPoint is not between 1/2 and 1 times the FullScaleRangeValue, return A
        if (
          fullScaleRange != null &&
          (scaleTransitionPoint > fullScaleRange ||
            scaleTransitionPoint < fullScaleRange * 0.5)
        ) {
          return this.getMessage('SPAN-59-A', {
            key: KEY,
          });
        }
      }
    }
    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
