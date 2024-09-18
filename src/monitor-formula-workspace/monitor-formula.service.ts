import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  MonitorFormulaBaseDTO,
  MonitorFormulaDTO,
} from '../dtos/monitor-formula.dto';
import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { withTransaction } from '../utils';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';

@Injectable()
export class MonitorFormulaWorkspaceService {
  constructor(
    private readonly repository: MonitorFormulaWorkspaceRepository,
    private readonly usedIdRepo: UsedIdentifierRepository,
    private readonly map: MonitorFormulaMap,
    private readonly logger: Logger,
    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {
    this.logger.setContext('MonitorFormulaWorkspaceService');
  }

  async getFormulas(locationId: string): Promise<MonitorFormulaDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getFormula(
    locationId: string,
    formulaRecordId: string,
    trx?: EntityManager,
  ): Promise<MonitorFormula> {
    const result = await withTransaction(this.repository, trx).getFormula(
      locationId,
      formulaRecordId,
    );

    if (!result) {
      throw new EaseyException(
        new Error('Monitor Formula Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locationId: locationId,
          formulaRecordId: formulaRecordId,
        },
      );
    }

    return result;
  }

  async createFormula({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MonitorFormulaBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorFormulaDTO> {
    const repository = withTransaction(this.repository, trx);

    const formula = repository.create({
      id: uuid(),
      locationId,
      formulaId: payload.formulaId,
      parameterCode: payload.parameterCode,
      formulaCode: payload.formulaCode,
      formulaText: payload.formulaText,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    await repository.save(formula);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(formula);
  }

  async updateFormula({
    locationId,
    formulaRecordId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    formulaRecordId: string;
    payload: MonitorFormulaBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }) {
    const formula = await this.getFormula(locationId, formulaRecordId, trx);

    formula.formulaId = payload.formulaId;
    formula.parameterCode = payload.parameterCode;
    formula.formulaCode = payload.formulaCode;
    formula.formulaText = payload.formulaText;
    formula.beginDate = payload.beginDate;
    formula.beginHour = payload.beginHour;
    formula.endDate = payload.endDate;
    formula.endHour = payload.endHour;
    formula.userId = userId;
    formula.updateDate = currentDateTime();

    await withTransaction(this.repository, trx).save(formula);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(formula);
  }

  async runFormulaChecks(
    formulas: MonitorFormulaBaseDTO[],
    locationId?: string,
  ) {
    const errorList: string[] = [];

    for (const formula of formulas) {
      const formulaRecord =
        locationId &&
        (await this.repository.findOneBy({
          locationId,
          formulaId: formula.formulaId,
        }));

      if (formulaRecord && !formulaRecord.endDate) {
        if (formulaRecord.parameterCode !== formula.parameterCode) {
          errorList.push(
            `[IMPORT9-CRIT1-A] The ParameterCode for Formula ID ${formulaRecord.formulaId} in the database is not equal to the ParameterCode ${formula.formulaId} in the incoming record`,
          );
        }

        if (
          formulaRecord.formulaCode !== null &&
          formulaRecord.formulaCode !== formula.formulaCode
        ) {
          errorList.push(
            `[IMPORT9-CRIT1-B] The FormulaCode for Formula ID ${formulaRecord.formulaId} in the database is not equal to the FormulaCode ${formula.formulaCode} in the incoming record`,
          );
        }
      }
    }

    return errorList;
  }

  async importFormula(
    formulas: MonitorFormulaBaseDTO[],
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    const repository = withTransaction(this.repository, trx);

    await Promise.all(
      formulas.map(async formula => {
        let formulaRecord = await repository.getFormulaByLocIdAndFormulaIdentifier(
          locationId,
          formula.formulaId,
        );

        if (!formulaRecord) {
          // Check used_identifier table to see if the formulaId has already
          // been used, and if so grab that monitor-formula record for update
          let usedIdentifier = await withTransaction(
            this.usedIdRepo,
            trx,
          ).getBySpecs(locationId, formula.formulaId, 'F');

          if (usedIdentifier)
            formulaRecord = await repository.findOneBy({
              id: usedIdentifier.id,
            });
        }

        if (formulaRecord) {
          await this.updateFormula({
            locationId,
            formulaRecordId: formulaRecord.id,
            payload: formula,
            userId,
            isImport: true,
            trx,
          });
        } else {
          await this.createFormula({
            locationId,
            payload: formula,
            userId,
            isImport: true,
            trx,
          });
        }
      }),
    );
    this.logger.debug(`Imported ${formulas.length} monitor formulas`);
    return true;
  }
}
