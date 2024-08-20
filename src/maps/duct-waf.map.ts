import { Injectable } from '@nestjs/common';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWaf } from '../entities/duct-waf.entity';
import { DuctWaf as WorkspaceDuctWaf } from '../entities/workspace/duct-waf.entity';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

@Injectable()
export class DuctWafMap extends BaseMap<
  DuctWaf | WorkspaceDuctWaf,
  DuctWafDTO
> {
  public async one(entity: DuctWaf | WorkspaceDuctWaf): Promise<DuctWafDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      wafDeterminationDate: entity.wafDeterminationDate,
      wafBeginDate: entity.wafBeginDate,
      wafBeginHour: entity.wafBeginHour,
      wafMethodCode: entity.wafMethodCode,
      wafValue: entity.wafValue,
      numberOfTestRuns: entity.numberOfTestRuns,
      numberOfTraversePointsWAF: entity.numberOfTraversePointsWaf,
      numberOfTestPorts: entity.numberOfTestPorts,
      numberOfTraversePointsRef: entity.numberOfTraversePointsRef,
      ductWidth: entity.ductWidth,
      ductDepth: entity.ductDepth,
      wafEndDate: entity.wafEndDate,
      wafEndHour: entity.wafEndHour,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.wafEndDate === null,
    };
  }
}
