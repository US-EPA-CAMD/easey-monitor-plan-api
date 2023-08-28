import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { ComponentCheckService } from '../component-workspace/component-checks.service';
import { UpdateMonitorSystemDTO } from '../dtos/monitor-system.dto';

@Injectable()
export class MonitorSystemCheckService {
  constructor(
    private readonly logger: Logger,
    private readonly componentChecksService: ComponentCheckService,
  ) {}

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

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new EaseyException(
        new Error(JSON.stringify(errorList)),
        HttpStatus.BAD_REQUEST,
      );
    }
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
  ) {
    let errorList: string[] = [];
    const promises: Promise<string[]>[] = [];

    monitorSystem.components?.forEach((systemComponent, sysCompIdx) => {
      promises.push(
        new Promise(async (resolve, _reject) => {
          const results = this.componentChecksService.runChecks(
            locationId,
            systemComponent,
            isImport,
            isUpdate,
            `${errorLocation}components.${sysCompIdx}.`,
          );

          resolve(results);
        }),
      );
    });

    errorList = await this.extractErrors(promises);
    this.throwIfErrors(errorList);
    return errorList;
  }
}
