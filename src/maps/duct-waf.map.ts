import { Injectable } from '@nestjs/common';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWaf } from '../entities/duct-waf.entity';
import { BaseMap } from './base.map';

@Injectable()
export class DuctWafMap extends BaseMap<DuctWaf, DuctWafDTO> {
  public async one(entity: DuctWaf): Promise<DuctWafDTO> {
    return {
      id: entity.id,
      locationId: entity.locationId,
      wafDeterminationDate: entity.wafDeterminationDate,
      wafBeginDate: entity.wafBeginDate,
      wafBeginHour: entity.wafBeginHour,
      wafMethodCode: entity.wafMethodCode,
      wafValue: entity.wafValue,
      numberOfTestRuns: entity.numberOfTestRuns,
      numberOfTraversePointsWaf: entity.numberOfTraversePointsWaf,
      numberOfTestPorts: entity.numberOfTestPorts,
      numberOfTraversePointsRef: entity.numberOfTraversePointsRef,
      ductWidth: entity.ductWidth,
      ductDepth: entity.ductDepth,
      wafEndDate: entity.wafEndDate,
      wafEndHour: entity.wafEndHour,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
