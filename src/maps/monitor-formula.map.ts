import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorFormula } from '../entities/monitor-formula.entity';
import { MonitorFormula as WorkspaceMonitorFormula } from '../entities/workspace/monitor-formula.entity';
import { MonitorFormulaDTO } from '../dtos/monitor-formula.dto';

@Injectable()
export class MonitorFormulaMap extends BaseMap<
  MonitorFormula | WorkspaceMonitorFormula,
  MonitorFormulaDTO
> {
  public async one(
    entity: MonitorFormula | WorkspaceMonitorFormula,
  ): Promise<MonitorFormulaDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      parameterCode: entity.parameterCode,
      formulaCode: entity.formulaCode,
      formulaId: entity.formulaId,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      endDate: entity.endDate,
      endHour: entity.endHour,
      formulaText: entity.formulaText,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
