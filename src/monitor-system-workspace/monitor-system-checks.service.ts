import { Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system.dto';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { throwIfErrors } from '../utils';

const KEY = 'Monitor System';
@Injectable()
export class MonitorSystemCheckService {
  constructor(
    private readonly logger: Logger,
    private readonly componentChecksService: ComponentCheckService,
    private readonly monitorSystemWorkspaceRepository: MonitorSystemWorkspaceRepository,
  ) { }

  private async extractErrors(
    promises: Promise<string[]>[],
  ): Promise<string[]> {
    const errorList: string[] = [];
    const errors = await Promise.all(promises);
    errors.forEach(p => {
      errorList.push(...p);
    });
    return [...new Set(errorList)];
  }


  getMessage(messageKey: string, messageArgs?: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }

  async runChecks(
    locationId: string,
    monitorSystem: UpdateMonitorSystemDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
    errorLocation: string = '',
    monitoringSystemId?: string
  ) {
    let error: string = null;
    let errorList: string[] = [];
    const promises: Promise<string[]>[] = [];

    errorList = await this.extractErrors(promises);

    if (!isImport) {
      error = await this.system24Check(locationId, monitorSystem, isUpdate, monitoringSystemId);

      if (error) {
        errorList.push(error);
      }
    }


    throwIfErrors(errorList);
    return errorList;
  }

  private async system24Check(
    locationId: string | null,
    monitorSystem: UpdateMonitorSystemDTO,
    isUpdate: boolean = false,
    excludeSystemId?: string,
  ): Promise<string> {

    const existingSystem = await this.monitorSystemWorkspaceRepository.findOneBy({
      locationId,
      monitoringSystemId: monitorSystem.monitoringSystemId
    });

    if (existingSystem && (!isUpdate || existingSystem.id !== excludeSystemId)) {
      return CheckCatalogService.formatResultMessage('SYSTEM-24-A', {
        fieldnames: 'monitoringSystemId',
        recordtype: KEY
      });
    }

    return null;
  }
}
