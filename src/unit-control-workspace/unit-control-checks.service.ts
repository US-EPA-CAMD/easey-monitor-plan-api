import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { UnitControlBaseDTO } from '../dtos/unit-control.dto';
import { UnitControl } from '../entities/workspace/unit-control.entity';

import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { UpdateMonitorLocationDTO } from 'src/dtos/monitor-location-update.dto';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { UnitRepository } from '../unit/unit.repository';

const KEY = 'Unit Control';

@Injectable()
export class UnitControlChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(UnitControlWorkspaceRepository)
    private readonly repository: UnitControlWorkspaceRepository,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly monitorLocationWorkspaceRepository: MonitorLocationWorkspaceRepository,
    @InjectRepository(UnitRepository)
    private readonly unitRepository: UnitRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    locId: string,
    unitId: number,
    unitControl: UnitControlBaseDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
    errorLocation: string = '',
    location?: UpdateMonitorLocationDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];

    if (isImport) {
      const unitRecord = await this.unitRepository.findOne({
        name: location.unitId,
      });
      unitId = unitRecord.id;
    }

    if (!isUpdate && !isImport) {
      error = await this.duplicateTestCheck(unitId, unitControl, errorLocation);
      if (error) {
        errorList.push(error);
      }
    }

    // Check that InstallDate, OptimizationDAte, and RetireDate make sense
    this.checkDatesForConsistency(unitControl, errorList);

    this.throwIfErrors(errorList, isImport);
    return errorList;
  }

  checkDatesForConsistency(
    unitControl: UnitControlBaseDTO,
    errorList: string[],
  ) {
    if (unitControl.optimizationDate) {
      if (
        (unitControl.installDate &&
          unitControl.optimizationDate < unitControl.installDate) ||
        (unitControl.retireDate &&
          unitControl.optimizationDate > unitControl.retireDate)
      )
        errorList.push(
          this.getMessage('CONTROL-4-A', {
            date: unitControl.optimizationDate,
            key: KEY,
          }),
        );
    }

    if (unitControl.installDate) {
      if (unitControl.originalCode === '1')
        errorList.push(this.getMessage('CONTROL-5-D', { key: KEY }));
    } else if (unitControl.originalCode !== '1')
      errorList.push(
        this.getMessage('CONTROL-5-A', { fieldname: 'installDate', key: KEY }),
      );
  }

  private async duplicateTestCheck(
    unitId: number,
    unitControl: UnitControlBaseDTO,
    errorLocation: string = '',
  ): Promise<string> {
    let error: string = null;
    let FIELDNAME: string = 'unitControl';
    let RECORDTYPE: string = 'parameterCode,controlCode,';

    let record: UnitControl = await this.repository.findOne({
      unitId: unitId,
      parameterCode: unitControl.parameterCode,
      controlCode: unitControl.controlCode,
      installDate: unitControl.installDate,
    });

    if (record) {
      // CONTROL-15 Duplicate Unit Control (Result A)
      RECORDTYPE += 'installDate';
      error =
        errorLocation +
        this.getMessage('CONTROL-15-A', {
          recordtype: RECORDTYPE,
          fieldnames: FIELDNAME,
        });
    } else {
      record = await this.repository.findOne({
        unitId: unitId,
        parameterCode: unitControl.parameterCode,
        controlCode: unitControl.controlCode,
        retireDate: unitControl.retireDate,
      });
      if (record) {
        // CONTROL-15 Duplicate Unit Control (Result A)
        RECORDTYPE += 'retireDate';
        error =
          errorLocation +
          this.getMessage('CONTROL-15-A', {
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
