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

  public throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    monitorSpan: MonitorSpanBaseDTO | MonitorSpanDTO,
    locationId: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    errorLocation: string = '',
  ): Promise<string[]> {
    this.logger.info('Running Monitor Span Checks');

    let error: string = null;
    const errorList: string[] = [];

    if (isUpdate) {
      // SPAN-55
      error = await this.duplicateSpanRecordCheck(locationId, monitorSpan);
      if (error) {
        errorList.push(error);
      }
    }

    // SPAN-17
    error = this.flowFullScaleRangeCheck(monitorSpan, errorLocation);
    if (error) {
      errorList.push(error);
    }

    // SPAN-56
    error = this.spanMPCValueValid(
      monitorSpan.componentTypeCode,
      monitorSpan.spanScaleCode,
      monitorSpan.mpcValue,
      errorLocation,
    );
    if (error) {
      errorList.push(error);
    }

    // SPAN-57
    error = this.spanMECValueValid(
      monitorSpan.componentTypeCode,
      monitorSpan.spanScaleCode,
      monitorSpan.mecValue,
      monitorSpan.defaultHighRange,
    );
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

    this.throwIfErrors(errorList);
    this.logger.info('Completed Monitor Span Checks');
    return errorList;
  }

  private flowFullScaleRangeCheck(
    monitorSpan: MonitorSpanBaseDTO,
    errorLocation: string = '',
  ): string {
    let error = null;
    let errorCode = null;
    let FIELDNAME = 'flowFullScaleRange';

    if (monitorSpan.componentTypeCode === 'FLOW') {
      if (!monitorSpan.flowFullScaleRange) {
        errorCode = 'SPAN-17-A';
      }

      if (
        monitorSpan.flowSpanValue &&
        monitorSpan.flowFullScaleRange < monitorSpan.flowSpanValue
      ) {
        errorCode = 'SPAN-17-B';
      }
    } else {
      if (monitorSpan.flowFullScaleRange) {
        errorCode = 'SPAN-17-C';
      }
    }

    if (errorCode) {
      error =
        errorLocation +
        this.getMessage(errorCode, {
          fieldname: FIELDNAME,
          key: KEY,
        });
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
    let CONDITION: string = 'HG or HCL';
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

  private spanMPCValueValid(
    componentTypeCode: string,
    spanScaleCode: string,
    mpcValue: number,
    errorLocation: string = '',
  ): string {
    let error: string = null;
    let errorCode: string = null;
    const FIELDNAME = 'mpcValue';

    if (componentTypeCode) {
      if (!mpcValue) {
        if (
          !['FLOW', 'O2'].includes(componentTypeCode) &&
          spanScaleCode === 'H'
        ) {
          errorCode = this.getMessage(errorCode, {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }

      if (mpcValue) {
        if (
          ['FLOW', 'O2'].includes(componentTypeCode) ||
          spanScaleCode === 'L'
        ) {
          errorCode = 'SPAN-56-B';
        } else {
          if (mpcValue <= 0) {
            errorCode = 'SPAN-56-C';
          }
        }
      }
    }

    if (errorCode) {
      error =
        errorLocation +
        this.getMessage(errorCode, {
          fieldname: FIELDNAME,
          key: KEY,
        });
    }

    return error;
  }

  private spanMECValueValid(
    componentTypeCode: string,
    spanScaleCode: string,
    mecValue: number,
    defaultHighRange: number,
  ): string {
    let error: string = null;

    if (componentTypeCode) {
      if (!mecValue) {
        if (
          !['FLOW', 'O2'].includes(componentTypeCode) &&
          spanScaleCode === 'L'
        ) {
          error = this.getMessage('SPAN-57-A', {
            key: KEY,
          });
        }

        if (
          ['SO2', 'HG', 'NOX'].includes(componentTypeCode) &&
          spanScaleCode === 'H' &&
          defaultHighRange
        ) {
          error = this.getMessage('SPAN-57-B', {
            key: KEY,
          });
        }
      }

      if (mecValue !== null) {
        if (['FLOW', 'HG', 'O2'].includes(componentTypeCode)) {
          error = this.getMessage('SPAN-57-C', {
            key: KEY,
          });
        } else {
          if (mecValue <= 0) {
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

  private async duplicateSpanRecordCheck(
    locationId: string,
    monitorSpan: MonitorSpanBaseDTO,
  ): Promise<string> {
    let error: string = null;
    let record: MonitorSpan;

    const baseFieldNames = ['locationId', 'componentTypeCode'];
    const isFlowType = monitorSpan.componentTypeCode === 'FLOW';

    // Helper function to fetch records and set error messages
    const fetchRecordAndSetError = async (
      beginDate: Date | undefined,
      beginHour: number | undefined,
      endDate: Date | undefined,
      endHour: number | undefined,
      additionalFieldNames: string[],
    ): Promise<void> => {
      record = await this.repository.getSpanByFilter(
        locationId,
        monitorSpan.componentTypeCode,
        beginDate,
        beginHour,
        endDate,
        endHour,
        !isFlowType ? undefined : monitorSpan.spanScaleCode,
      );

      console.log(record);

      if (record) {
        error = this.getMessage('SPAN-55-A', {
          recordtype: KEY,
          fieldnames: [...baseFieldNames, ...additionalFieldNames],
        });
      }
    };

    await fetchRecordAndSetError(
      monitorSpan.beginDate,
      monitorSpan.beginHour,
      undefined,
      undefined,
      ['beginDate', 'beginHour', !isFlowType ? 'spanScaleCode' : ''],
    );

    if (!record && monitorSpan.endDate) {
      await fetchRecordAndSetError(
        undefined,
        undefined,
        monitorSpan.endDate,
        monitorSpan.endHour,
        ['endDate', 'endHour', !isFlowType ? 'spanScaleCode' : ''],
      );
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
