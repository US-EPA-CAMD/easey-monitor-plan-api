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
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    this.logger.info('Running Monitor Span Checks');

    let error: string = null;
    const errorList: string[] = [];

    // SPAN-17
    error = this.flowFullScaleRangeCheck(monitorSpan);
    if (error) {
      errorList.push(error);
    }

    // SPAN-58
    error = this.highSpanScaleTransitionPointCheck(monitorSpan);
    if (error) {
      errorList.push(error);
    }

    // SPAN-59
    error = this.lowSpanScaleTransitionPointCheck(monitorSpan);
    if (error) {
      errorList.push(error);
    }

    // SPAN-61
    error = this.spanScaleTransitionPointCheck(monitorSpan);
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

  private flowFullScaleRangeCheck(monitorSpan: MonitorSpanBaseDTO): string {
    let error = null;
    let FIELDNAME = 'flowFullScaleRange';

    // If the ComponentTypeCode is equal to "FLOW"
    if (monitorSpan.componentTypeCode === 'FLOW') {
      // If the FlowFullScaleRange is null, return A
      if (!monitorSpan.flowFullScaleRange) {
        return this.getMessage('SPAN-17-A', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
      // If the FlowSpanValue is valid, and the FlowFullScaleRange is not greater than or equal to the FlowSpanValue, return B
      if (
        monitorSpan.flowSpanValue &&
        monitorSpan.flowFullScaleRange < monitorSpan.flowSpanValue
      ) {
        return this.getMessage('SPAN-17-B', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    } else {
      // If the ComponentTypeCode is not equal to "FLOW", and the FlowFullScaleRange is not null
      if (monitorSpan.flowFullScaleRange) {
        return this.getMessage('SPAN-17-C', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    }
    return error;
  }

  private highSpanScaleTransitionPointCheck(
    monitorSpan: MonitorSpanBaseDTO,
  ): string {
    let error = null;

    // For a Monitoring Span record with a valid ComponentTypeCode and a SpanScale equal to "H"
    if (monitorSpan.spanScaleCode === 'H') {
      // If ScaleTransitionPoint is not null
      if (monitorSpan.scaleTransitionPoint) {
        // If SpanValue is null and DefaultHighRangeValue is not null, return A

        if (!monitorSpan.spanValue) {
          return this.getMessage('SPAN-58-A', {
            key: KEY,
          });
        }
      }
    }
    return error;
  }
  private lowSpanScaleTransitionPointCheck(
    monitorSpan: MonitorSpanBaseDTO,
  ): string {
    let error = null;

    // Monitoring Span record with a valid ComponentTypeCode and a SpanScale equal to "L"
    if (monitorSpan.spanScaleCode === 'L') {
      // If ScaleTransitionPoint is not null(true)
      if (monitorSpan.scaleTransitionPoint) {
        // If FullScaleRangeValue is not null(true), and the ScaleTransitionPoint is not between 1/2 and 1 times the FullScaleRangeValue(if it's not greater or not less than HALF the FSRV), return A
        if (
          monitorSpan.fullScaleRange &&
          (monitorSpan.scaleTransitionPoint > monitorSpan.fullScaleRange ||
            monitorSpan.scaleTransitionPoint < monitorSpan.fullScaleRange * 0.5)
        ) {
          return this.getMessage('SPAN-59-A', {
            key: KEY,
          });
        }
      }
    }
    return error;
  }

  private spanScaleTransitionPointCheck(
    monitorSpan: MonitorSpanBaseDTO,
  ): string {
    let error = null;
    let FIELDNAME: string = 'spanScaleTransitionPoint';
    let CONDITION: string = 'HG or HCL'
    let scaleTransitionPoint = monitorSpan.scaleTransitionPoint;

    // For a Monitoring Span record with a valid ComponentTypeCode equal to "HG" or "HCL"
    if (['HG', 'HCL'].includes(monitorSpan.componentTypeCode)) {
      // If ScaleTransitionPoint is not null, return A
      if (scaleTransitionPoint) {
        return this.getMessage('SPAN-61-A', {
          fieldname: FIELDNAME,
          condition: CONDITION,
        });
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
        monitorSpan.spanScaleCode,
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
