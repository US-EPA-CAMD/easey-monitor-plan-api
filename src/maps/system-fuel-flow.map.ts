import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';

@Injectable()
export class SystemFuelFlowMap extends BaseMap<SystemFuelFlow, SystemFuelFlowDTO> {
  public async one(entity: SystemFuelFlow): Promise<SystemFuelFlowDTO> {
    return {
      id: entity.id,
      monSysId: entity.monSysId,
      fuelCode: entity.system.fuelCode,
      systemTypeCode: entity.system.systemTypeCode,
      maxRate: entity.maxRate,
      maxRateSourceCode: entity.maxRateSourceCode,
      sysFuelUomCode: entity.sysFuelUomCode,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      beginHour: entity.beginHour,
      endHour: entity.endHour,
      active: entity.endDate === null,
    };
  }
}
