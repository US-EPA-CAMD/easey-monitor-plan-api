import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethod } from 'src/entities/monitor-method.entity';

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

  async getMethod(methodId: string) {
    const method = await this.repository.findOne(methodId);

    return method;
  }

  setStatus(monitoringMethod: MonitorMethodDTO[]): MonitorMethodDTO[] {
    monitoringMethod.forEach(m => {
      if (m.endDate == null) {
        m.active = true;
      }
    });
    return monitoringMethod;
  }

  async createMethod(payload: MonitorMethodDTO): Promise<MonitorMethod> {
    const {
      monLocId,
      parameterCode,
      subDataCode,
      bypassApproachCode,
      methodCode,
      beginDate,
      beginHour,
      endDate,
      endHour,
      userId,
      addDate,
      updateDate,
    } = payload;

    const monMethod = this.repository.create({
      id: uuid(),
      monLocId,
      parameterCode,
      subDataCode,
      bypassApproachCode,
      methodCode,
      beginDate,
      beginHour,
      endDate,
      endHour,
      userId,
      addDate,
      updateDate,
    });

    return await this.repository.save(monMethod);
  }

  async updateMethod(
    methodId: string,
    payload: MonitorMethodDTO,
  ): Promise<MonitorMethod> {
    const method = await this.getMethod(methodId);

    const {
      monLocId,
      parameterCode,
      subDataCode,
      bypassApproachCode,
      methodCode,
      beginDate,
      beginHour,
      endDate,
      endHour,
      userId,
      addDate,
      updateDate,
    } = payload;

    (method.monLocId = monLocId),
      (method.parameterCode = parameterCode),
      (method.subDataCode = subDataCode),
      (method.bypassApproachCode = bypassApproachCode),
      (method.methodCode = methodCode),
      (method.beginDate = beginDate),
      (method.beginHour = beginHour),
      (method.endDate = endDate),
      (method.endHour = endHour),
      (method.userId = userId),
      (method.addDate = addDate),
      (method.updateDate = updateDate),
      await this.repository.save(method);

    return method;
  }
}
