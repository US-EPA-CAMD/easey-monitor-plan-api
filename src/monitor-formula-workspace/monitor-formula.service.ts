import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { v4 as uuid } from 'uuid';
import {
  MonitorFormulaBaseDTO,
  MonitorFormulaDTO,
} from '../dtos/monitor-formula.dto';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';

@Injectable()
export class MonitorFormulaWorkspaceService {
  constructor(
    @InjectRepository(MonitorFormulaWorkspaceRepository)
    private readonly repository: MonitorFormulaWorkspaceRepository,
    private readonly map: MonitorFormulaMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getFormulas(locationId: string): Promise<MonitorFormulaDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getFormula(
    locationId: string,
    formulaRecordId: string,
  ): Promise<MonitorFormula> {
    const result = await this.repository.getFormula(
      locationId,
      formulaRecordId,
    );

    if (!result) {
      this.logger.error(NotFoundException, 'Monitor Formula not found', true, {
        locationId: locationId,
        formulaRecordId: formulaRecordId,
      });
    }

    return result;
  }

  async createFormula(
    locationId: string,
    payload: MonitorFormulaBaseDTO,
    userId: string,
  ): Promise<MonitorFormulaDTO> {
    const formula = this.repository.create({
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
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    await this.repository.save(formula);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(formula);
  }

  async updateFormula(
    locationId: string,
    formulaRecordId: string,
    payload: MonitorFormulaBaseDTO,
    userId: string,
  ) {
    const formula = await this.getFormula(locationId, formulaRecordId);

    formula.formulaId = payload.formulaId;
    formula.parameterCode = payload.parameterCode;
    formula.formulaCode = payload.formulaCode;
    formula.formulaText = payload.formulaText;
    formula.beginDate = payload.beginDate;
    formula.beginHour = payload.beginHour;
    formula.endDate = payload.endDate;
    formula.endHour = payload.endHour;
    formula.userId = userId;
    formula.updateDate = new Date(Date.now());

    await this.repository.save(formula);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(formula);
  }

  async runFormulaChecks(
    formulas: MonitorFormulaBaseDTO[],
    location: UpdateMonitorLocationDTO,
    locationId: string,
  ) {
    const errorList: string[] = [];

    for (const formula of formulas) {
      const formulaRecord = await this.repository.findOne({
        locationId,
        formulaId: formula.formulaId,
      });

      if (
        formulaRecord &&
        formulaRecord.parameterCode !== formula.parameterCode
      ) {
        errorList.push(
          'CRIT1-A',
          `The ParameterCode ${formula.parameterCode} for UnitStackPipeID ${location.unitId}/${location.stackPipeId} and FormulaID ${formula.formulaId} does not match the parameter code in the Workspace database.`,
        );
      }

      if (
        formulaRecord &&
        formulaRecord.formulaCode !== null &&
        formulaRecord.formulaCode !== formula.formulaCode
      ) {
        errorList.push(
          'CRIT1-B',
          `The FormulaCode ${formula.formulaCode} for UnitStackPipeID ${location.unitId}/${location.stackPipeId} and FormulaID ${formula.formulaId} does not match the formula code in the Workspace database.`,
        );
      }
    }

    return errorList;
  }

  async importFormula(
    formulas: MonitorFormulaBaseDTO[],
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];

      for (const formula of formulas) {
        promises.push(
          new Promise(async innerResolve => {
            const formulaRecord = await this.repository.getFormulaByLocIdAndFormulaIdentifier(
              locationId,
              formula.formulaId,
            );

            if (formulaRecord !== undefined) {
              await this.updateFormula(
                locationId,
                formulaRecord.id,
                formula,
                userId,
              );
            } else {
              await this.createFormula(locationId, formula, userId);
            }

            innerResolve(true);
          }),
        );

        await Promise.all(promises);
        resolve(true);
      }
    });
  }
}
