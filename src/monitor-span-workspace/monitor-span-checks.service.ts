import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSpanBaseDTO, MonitorSpanDTO } from '../dtos/monitor-span.dto';
import { MonitorSpanWorkspaceRepository } from './monitor-span.repository';
import { MonitorSpan } from '../entities/workspace/monitor-span.entity';

const KEY = 'Monitor Span';

@Injectable()
export class MonitorSpanChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private readonly repository: MonitorSpanWorkspaceRepository,
  ) {}

  private mpcValueValid: boolean;
  private mecValueValid: boolean;

  public throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runSpanChecks(
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

    error = await this.spanScaleTransitionPointCheck(monitorSpan, locationId);
    if (error) {
      errorList.push(error);
    }

    // SPAN-55
    error = await this.duplicateSpanRecordCheck(locationId, monitorSpan);
    if (error) {
      errorList.push(error);
    }

    // SPAN-56
    error = this.spanMPCValueValid(
      monitorSpan.componentTypeCode,
      monitorSpan.spanMethodCode,
      monitorSpan.mpcValue,
    );
    if (error) {
      errorList.push(error);
    }

    // SPAN-57
    error = this.spanMECValueValid(
      monitorSpan.componentTypeCode,
      monitorSpan.spanScaleCode,
      monitorSpan.mecValue,
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
    const record = await this.repository.findOne({
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
        monitorSpan.componentTypeCode !== 'FLOW' &&
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
    const record = await this.repository.findOne({
      locationId: locationId,
      componentTypeCode: monitorSpan.componentTypeCode,
    });

    // For a Monitoring Span record with a valid ComponentTypeCode and a SpanScale equal to "H"
    if (record && spanScale === 'H') {
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
    return error;
  }
  private async lowSpanScaleTransitionPointCheck(
    monitorSpan: MonitorSpanBaseDTO,
    locationId: string,
  ): Promise<string> {
    let error = null;
    let spanScale = monitorSpan.spanScaleCode;
    let scaleTransitionPoint = monitorSpan.scaleTransitionPoint;
    let fullScaleRange = monitorSpan.fullScaleRange;
    const record = await this.repository.findOne({
      locationId: locationId,
      componentTypeCode: monitorSpan.componentTypeCode,
    });

    // Monitoring Span record with a valid ComponentTypeCode and a SpanScale equal to "L"
    if (record && spanScale === 'L') {
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
      if (
        component.componentTypeCode === 'HG' ||
        component.componentTypeCode === 'HCL'
      ) {
        if (monitorSpan.scaleTransitionPoint !== null) {
          return this.getMessage('SPAN-61-A', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
    }
    return error;
  }

  private async duplicateSpanRecordCheck(
    locationId: string,
    monitorSpan: MonitorSpanBaseDTO,
  ): Promise<string> {
    let error: string = null;
    let record: MonitorSpan;

    if (monitorSpan.componentTypeCode && monitorSpan.beginDate) {
      record = await this.repository.getSpanByLocIdCompTypeCdBDateBHour(
        locationId,
        monitorSpan.componentTypeCode,
        monitorSpan.beginDate,
        monitorSpan.beginHour,
      );

      if (record) {
        error = this.getMessage('SPAN-55-A', {
          recordtype: 'Monitor Span record',
          fieldnames: [
            'locationId',
            'componentTypeCode',
            'beginDate',
            'beginHour',
          ],
        });
      }

      if (!record && monitorSpan.endDate) {
        let record: MonitorSpan = await this.repository.getSpanByLocIdCompTypeCdEDateEHour(
          locationId,
          monitorSpan.componentTypeCode,
          monitorSpan.endDate,
          monitorSpan.endHour,
        );

        if (record) {
          error = this.getMessage('SPAN-55-A', {
            recordtype: 'Monitor Span record',
            fieldnames: [
              'locationId',
              'componentTypeCode',
              'endDate',
              'endHour',
            ],
          });
        }
      }
    }

    return error;
  }

  private spanMPCValueValid(
    componentTypeCode: string,
    spanScaleCode: string,
    mpcValue: number,
  ): string {
    let error: string = null;

    if (componentTypeCode) {
      if (!mpcValue) {
        if (
          !['FLOW', 'O2'].includes(componentTypeCode) &&
          spanScaleCode === 'H'
        ) {
          this.mpcValueValid = false;

          error = this.getMessage('SPAN-56-A', {
            key: KEY,
          });
        }
      }

      if (mpcValue !== null) {
        if (
          ['FLOW', 'O2'].includes(componentTypeCode) &&
          spanScaleCode === 'L'
        ) {
          this.mpcValueValid = false;

          error = this.getMessage('SPAN-56-B', {
            key: KEY,
          });
        } else {
          if (mpcValue <= 0) {
            this.mpcValueValid = false;

            error = this.getMessage('SPAN-56-C', {
              fieldname: 'mpcValue',
              key: KEY,
            });
          }
        }
      }
    }

    return error;
  }

  private spanMECValueValid(
    componentTypeCode: string,
    spanScaleCode: string,
    mecValue: number,
  ): string {
    let error: string = null;

    if (componentTypeCode) {
      if (!mecValue) {
        if (
          !['FLOW', 'O2'].includes(componentTypeCode) &&
          spanScaleCode === 'L'
        ) {
          this.mecValueValid = false;

          error = this.getMessage('SPAN-57-A', {
            key: KEY,
          });
        }

        if (
          ['SO2', 'HG', 'NOX'].includes(componentTypeCode) &&
          spanScaleCode === 'H'
        ) {
          this.mecValueValid = false;

          error = this.getMessage('SPAN-57-B', {
            key: KEY,
          });
        }
      }

      if (mecValue !== null) {
        if (['FLOW', 'HG', 'O2'].includes(componentTypeCode)) {
          this.mpcValueValid = false;

          error = this.getMessage('SPAN-57-C', {
            key: KEY,
          });
        } else {
          if (mecValue <= 0) {
            this.mpcValueValid = false;

            error = this.getMessage('SPAN-57-D', {
              fieldname: 'mpcValue',
              key: KEY,
            });
          }
        }
      }
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
