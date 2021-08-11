import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorMethodDTO } from '../dtos/monitor-method.dto';
import { UpdateMonitorMethodDTO } from '../dtos/update-monitor-method.dto';
import { MonitorMethodMap } from '../maps/workspace/monitor-method.map';
import { MonitorMethod } from '../entities/workspace/monitor-method.entity';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';

@Injectable()
export class MonitorMethodWorkspaceService {
  constructor(
    @InjectRepository(MonitorMethodWorkspaceRepository)
    private repository: MonitorMethodWorkspaceRepository,
    private map: MonitorMethodMap,
  ) {}

  async getMethods(locId: string): Promise<MonitorMethodDTO[]> {
    const results = await this.repository.find({ monLocId: locId });
    return this.map.many(results);
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
    return this.map.one(entity);
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
    method.beginDate = payload.beginDate;
    method.beginHour = payload.beginHour;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;

    // TODO: this needs to be the actual user that is logged in
    // how are we going to get this from CDX as this is an id NOT a username
    method.userId = 'testuser';
    method.updateDate = new Date(Date.now());

    const result = await this.repository.save(method);
    return this.map.one(result);
  }
}
