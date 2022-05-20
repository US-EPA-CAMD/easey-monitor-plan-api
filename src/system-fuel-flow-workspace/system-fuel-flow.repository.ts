import { SystemFuelFlowBaseDTO } from '../dtos/system-fuel-flow.dto';
import { Repository, EntityRepository } from 'typeorm';

import { SystemFuelFlow } from '../entities/workspace/system-fuel-flow.entity';

@EntityRepository(SystemFuelFlow)
export class SystemFuelFlowWorkspaceRepository extends Repository<
  SystemFuelFlow
> {
  async getFuelFlow(id: string): Promise<SystemFuelFlow> {
    return this.createQueryBuilder('sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('sff.id = :id', { id })
      .getOne();
  }

  async getFuelFlows(monSysId: string): Promise<SystemFuelFlow[]> {
    return this.createQueryBuilder('sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('ms.id = :monSysId', { monSysId })
      .getMany();
  }

  async getFuelFlowsBySystemIds(
    monSysIds: string[],
  ): Promise<SystemFuelFlow[]> {
    return this.createQueryBuilder('sff')
      .innerJoinAndSelect('sff.system', 'ms')
      .where('ms.id IN (:...monSysIds)', { monSysIds })
      .getMany();
  }

  async getFuelFlowByBeginOrEndDate(
    monSysId: string,
    fuelFlow: SystemFuelFlowBaseDTO,
  ): Promise<SystemFuelFlow> {
    const beginDate = fuelFlow.beginDate;
    const beginHour = fuelFlow.beginHour;
    const endDate = fuelFlow.endDate;
    const endHour = fuelFlow.endHour;

    return this.createQueryBuilder('sff')
      .where('sff.monitoringSystemRecordId = :monSysId', { monSysId })
      .andWhere(
        '(sff.beginDate = :beginDate AND sff.beginHour = :beginHour) OR (sff.endDate = :endDate AND sff.endHour = :endHour)',
        {
          beginDate,
          beginHour,
          endDate,
          endHour,
        },
      )
      .getOne();
  }
}
