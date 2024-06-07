import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService, EaseyException } from '@us-epa-camd/easey-common';

import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';
import { MonitorFormulaBaseDTO } from '../dtos/monitor-formula.dto';

@Injectable()
export class MonitorFormulaChecksService {
  constructor(private readonly repository: MonitorFormulaWorkspaceRepository) {}

  private async duplicateFormulaIdCheck(
    locationId: string,
    monitorFormula: MonitorFormulaBaseDTO,
    recordId?: string,
  ) {
    const formula = await this.repository.getFormulaByLocIdAndFormulaIdentifier(
      locationId,
      monitorFormula.formulaId,
    );
    if (formula) {
      if (recordId && formula.id === recordId) return null; // Valid update

      return CheckCatalogService.formatResultMessage('FORMULA-18-A', {
        fieldnames: ['formulaId', 'locationId'],
        recordtype: 'Monitor Formula',
      });
    }
    return null;
  }

  async runChecks(
    monitorFormula: MonitorFormulaBaseDTO,
    locationId: string,
    recordId?: string,
  ) {
    const errorList = (
      await Promise.all([
        this.duplicateFormulaIdCheck(locationId, monitorFormula, recordId), // FORMULA-18-A
      ])
    ).filter(error => error !== null);

    this.throwIfErrors(errorList);
    return errorList;
  }

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new EaseyException(
        new Error(JSON.stringify(errorList)),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
