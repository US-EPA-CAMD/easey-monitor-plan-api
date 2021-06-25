import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorMethod } from 'src/entities/monitor-method.entity';
import { UpdateMonitorMethodDTO } from 'src/dtos/update-monitor-method.dto';

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

  async getMethod(methodId: string): Promise<MonitorMethod> {
    const result = this.repository.findOne(methodId);

    if (!result) {
      throw new NotFoundException('Monitor method not found');
    }

    return result;
  }

  async createMethod(
    locId: string,
    payload: UpdateMonitorMethodDTO,
  ): Promise<MonitorMethodDTO> {
    const monMethod = this.repository.create({
      id: uuid(),
      monLocId: locId,
      parameterCode: payload.parameterCode,
      subDataCode: payload.subDataCode,
      bypassApproachCode: payload.bypassApproachCode,
      methodCode: payload.methodCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
      // TODO: this needs to be the actual user that is logged in
      // how are we going to get this from CDX as this is an id NOT a username
      userId: 'testuser',

      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const entity = await this.repository.save(monMethod);
    const result = await this.map.one(entity);

    return result;
  }

  async updateMethod(
    methodId: string,
    payload: UpdateMonitorMethodDTO,
  ): Promise<MonitorMethodDTO> {
    const method = await this.getMethod(methodId);
    method.parameterCode = payload.parameterCode;
    method.subDataCode = payload.subDataCode;
    method.bypassApproachCode = payload.bypassApproachCode;
    method.methodCode = payload.methodCode;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;

    // TODO: this needs to be the actual user that is logged in
    // how are we going to get this from CDX as this is an id NOT a username
    method.userId = 'testuser';
    method.updateDate = new Date(Date.now());

    const result = await this.repository.save(method);
    const monMethod = await this.map.one(result);

    return monMethod;
  }

  private setStatus(monitoringMethod: MonitorMethodDTO[]): MonitorMethodDTO[] {
    monitoringMethod.forEach(m => {
      if (m.endDate == null) {
        m.active = true;
      }
    });
    return monitoringMethod;
  }
}
