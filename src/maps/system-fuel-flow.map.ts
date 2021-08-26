import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';
import { SystemFuelFlowDTO } from '../dtos/system-fuel-flow.dto';

@Injectable()
export class SystemFuelFlowMap extends BaseMap<
  SystemFuelFlow,
  SystemFuelFlowDTO
> {
  public async one(entity: SystemFuelFlow): Promise<SystemFuelFlowDTO> {
    return {
      id: entity.id,
      monitoringSystemRecordId: entity.monitoringSystemRecordId,
      fuelCode: entity.system.fuelCode,
      systemTypeCode: entity.system.systemTypeCode,
      maximumFuelFlowRate: entity.maximumFuelFlowRate,
      systemFuelFlowUOMCode: entity.systemFuelFlowUOMCode,
      maximumFuelFlowRateSourceCode: entity.maximumFuelFlowRateSourceCode,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      beginHour: entity.beginHour,
      endHour: entity.endHour,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      active: entity.endDate === null,
    };
  }
}
