import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateMonitorFormulaDTO } from '../dtos/monitor-formula-update.dto';
import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorFormulaWorkspaceRepository } from './monitor-formula.repository';

@Injectable()
export class MonitorFormulaWorkspaceService {
  constructor(
    @InjectRepository(MonitorFormulaWorkspaceRepository)
    private repository: MonitorFormulaWorkspaceRepository,
    private map: MonitorFormulaMap,
  ) {}

  async getFormulas(locationId: string): Promise<MonitorFormulaDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getFormula(
    locationId: string,
    formulaRecordId: string,
  ): Promise<MonitorFormulaDTO> {
    const result = await this.repository.getFormula(
      locationId,
      formulaRecordId,
    );

    if (!result) {
      throw new NotFoundException('Monitor Formula not found');
    }

    return this.map.one(result);
  }

  async createFormula(
    locationId: string,
    userId: string,
    payload: UpdateMonitorFormulaDTO,
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
      userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(formula);

    return this.map.one(result);
  }

  async updateFormula(
    locationId: string,
    formulaRecordId: string,
    userId: string,
    payload: UpdateMonitorFormulaDTO,
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

    const result = await this.repository.save(formula);

    return this.map.one(result);
  }
}
