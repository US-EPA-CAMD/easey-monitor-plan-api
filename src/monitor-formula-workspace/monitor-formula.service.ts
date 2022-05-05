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
}
