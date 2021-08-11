import { Injectable } from '@nestjs/common';

import { BaseMap } from '../base.map';
import { MonitorFormula } from '../../entities/workspace/monitor-formula.entity';
import { MonitorFormulaDTO } from '../../dtos/monitor-formula.dto';

@Injectable()
export class MonitorFormulaMap extends BaseMap<
  MonitorFormula,
  MonitorFormulaDTO
> {
  public async one(entity: MonitorFormula): Promise<MonitorFormulaDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      parameterCd: entity.parameterCd,
      equationCd: entity.equationCd,
      formulaIdentifier: entity.formulaIdentifier,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      formulaEquation: entity.formulaEquation,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
