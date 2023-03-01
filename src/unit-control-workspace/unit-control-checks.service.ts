import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  UnitControlBaseDTO,
} from '../dtos/unit-control.dto';
import { UnitControl } from '../entities/workspace/unit-control.entity';

import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { UpdateMonitorLocationDTO } from 'src/dtos/monitor-location-update.dto';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';

@Injectable()
export class UnitControlChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(UnitControlWorkspaceRepository)
    private readonly repository: UnitControlWorkspaceRepository,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly monitorLocationWorkspaceRepository: MonitorLocationWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    unitControl: UnitControlBaseDTO,
    unitId: string,
    locId: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    location?: UpdateMonitorLocationDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let locationRecord;
    this.logger.info('Running Unit Control Checks');

    if (isImport) {
      locationRecord = location;
    } else {
      locationRecord = await this.monitorLocationWorkspaceRepository.findOne(
        locId,
      );
    }

    if (!isUpdate) {
      error = await this.duplicateTestCheck(
        unitId,
        unitControl,
        isImport,
      );
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Unit Control Checks');
    return errorList;
  }

  private async duplicateTestCheck(
    unitId: string,
    unitControl: UnitControlBaseDTO,
    _isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;
    let FIELDNAME: string = 'unitControl'
    let RECORDTYPE: string = 'parameterCode,controlCode,';

    let record: UnitControl = await this.repository.findOne({
      unitId: parseInt(unitId),
      parameterCode: unitControl.parameterCode,
      controlCode: unitControl.controlCode,
      installDate: unitControl.installDate,
    });

    if (record) {
      // CONTROL-15 Duplicate Unit Control (Result A)
      RECORDTYPE += 'installDate';
      error = this.getMessage('CONTROL-15-A', {
        recordtype: RECORDTYPE,
        fieldnames: FIELDNAME,
      });
    } else {
      record = await this.repository.findOne({
        unitId: parseInt(unitId),
        parameterCode: unitControl.parameterCode,
        controlCode: unitControl.controlCode,
        retireDate: unitControl.retireDate,
      });
      if (record) {
        // CONTROL-15 Duplicate Unit Control (Result A)
        RECORDTYPE += 'retireDate';
        error = this.getMessage('CONTROL-15-A', {
          recordtype: RECORDTYPE,
          fieldnames: FIELDNAME,
        });
      }
    }
    return error;
  }
  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
