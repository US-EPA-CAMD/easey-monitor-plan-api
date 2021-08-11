import { Injectable } from '@nestjs/common';
import { DuctWafDTO } from '../../dtos/duct-waf.dto';
import { DuctWaf } from '../../entities/workspace/duct-waf.entity';
import { BaseMap } from '../base.map';

@Injectable()
export class DuctWafMap extends BaseMap<DuctWaf, DuctWafDTO> {
  public async one(entity: DuctWaf): Promise<DuctWafDTO> {
    return {
      id: entity.id,
      monLocId: entity.monLocId,
      wafDeterminedDate: entity.wafDeterminedDate,
      wafEffectiveDate: entity.wafEffectiveDate,
      wafEffectiveHour: entity.wafEffectiveHour,
      wafMethodCd: entity.wafMethodCd,
      wafValue: entity.wafValue,
      numTestRuns: entity.numTestRuns,
      numTraversePointsRef: entity.numTraversePointsRef,
      ductWidth: entity.ductWidth,
      ductDepth: entity.ductWidth,
      endDate: entity.endDate,
      endHour: entity.endHour,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      userId: entity.userId,
    };
  }
}
