import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';
import { MonitorMethodMap } from '../maps/monitor-method.map';

@Injectable()
export class MonitorMethodWorkspaceService {
  constructor(
    @InjectRepository(MonitorMethodWorkspaceRepository)
    private repository: MonitorMethodWorkspaceRepository,
    private map: MonitorMethodMap,
  ) {}

  async getMethods(locId: string): Promise<MonitorMethodDTO[]> {
    const findOpts: FindManyOptions = {
      select: [
        'id',
        'parameterCode',
        'methodCode',
        'subDataCode',
        'bypassApproachCode',
        'beginDate',
        'beginHour',
        'endDate',
        'endHour',
      ],
      where: { monLocId: locId },
    };
    const results = await this.repository.find(findOpts);
    const monMethods = await this.map.many(results);
    return this.setStatus(monMethods);
  }

  setStatus(
    monitoringMethod: MonitorMethodDTO[],
  ): MonitorMethodDTO[] {
    monitoringMethod.forEach(m => {
      if (m.endDate == null) {
        m.active = true;
      }
    });
    return monitoringMethod;
  }

  createMethod(
    locId: string,
    payload: MonitorMethodDTO,
  ): Promise<MonitorMethodDTO> {
    //need actual logic here
    return this.repository.save(new MonitorMethodDTO());
  }

  updateMethod(
    locId: string,
    methodId: string,    
    payload: MonitorMethodDTO,
  ): Promise<MonitorMethodDTO> {
    //need actual logic here
    return this.repository.save(new MonitorMethodDTO());
  }

}
