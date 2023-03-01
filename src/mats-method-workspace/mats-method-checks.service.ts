import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MAXIMUM_FUTURE_DATE } from '../utilities/constants';
import { MatsMethodBaseDTO, MatsMethodDTO } from '../dtos/mats-method.dto';

const moment = require('moment');

@Injectable()
export class MatsMethodChecksService {
  constructor(private readonly logger: Logger) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  getMessage(messageKey: string, messageArgs?: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }

  async runChecks(
    matsMethod: MatsMethodDTO | MatsMethodBaseDTO,
    _isImport: boolean = false,
    _isUpdate: boolean = false,
  ) {
    this.logger.info('Running Monitor Plan Checks');

    const errorList: string[] = [];
    let error: string = null;

    error = this.matsMethod3And4Check(matsMethod);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed Monitor Plan Checks');
    return errorList;
  }

  private matsMethod3And4Check(
    matsMethod: MatsMethodDTO | MatsMethodBaseDTO,
  ): string {
    let error = null;

    if (!matsMethod.endHour && matsMethod.endDate) {
      error = this.getMessage('MATSMTH-4-C');
      return error;
    }

    if (matsMethod.endDate) {
      let beginDate,
        endDate = null;

      if (matsMethod.beginDate) {
        beginDate = moment(matsMethod.beginDate);
        if (matsMethod.beginHour) {
          beginDate.hours(matsMethod.beginHour);
        }
      }
      if (matsMethod.endDate) {
        endDate = moment(matsMethod.endDate);
        if (matsMethod.endHour) {
          endDate.hours(matsMethod.endHour);
        }
      }

      if (beginDate && endDate.isBefore(beginDate)) {
        error = this.getMessage('MATSMTH-3-A');
      } else if (MAXIMUM_FUTURE_DATE && endDate.isAfter(MAXIMUM_FUTURE_DATE)) {
        error = this.getMessage('MATSMTH-3-B');
      }
    }

    return error;
  }
}
