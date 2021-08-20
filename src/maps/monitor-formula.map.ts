import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { MonitorFormula } from '../entities/monitor-formula.entity';
import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';

@Injectable()
export class MonitorFormulaMap extends BaseMap<
  MonitorFormula,
  MonitorFormulaDTO
> {
  public async one(entity: MonitorFormula): Promise<MonitorFormulaDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      parameterCode: entity.parameterCode,
      equationCode: entity.equationCode,
      formulaId: entity.formulaId,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      formulaText: entity.formulaText,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
