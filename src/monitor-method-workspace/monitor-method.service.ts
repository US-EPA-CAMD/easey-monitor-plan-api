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

  async getMethod(methodId: string) : Promise<MonitorMethod> {
    return this.repository.findOne(methodId);
  }

  async createMethod(locId: string, payload: MonitorMethodDTO): Promise<MonitorMethod> {
    const monMethod = this.repository.create({
      id: uuid(),

      // TODO: need to use the locId from path and validate
      monLocId: payload.monLocId,
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
      userId: payload.userId,

      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    return this.repository.save(monMethod);
  }

  async updateMethod(
    locId: string,
    methodId: string,
    payload: MonitorMethodDTO,
  ): Promise<MonitorMethod> {

    // TODO: need to use the locId from path and validate
    const method = await this.getMethod(methodId);

    // not updating these fields...
    // mon_method_id, mon_loc_id, begin_date, begin_hour, add_date

    method.parameterCode = payload.parameterCode;
    method.subDataCode = payload.subDataCode;
    method.bypassApproachCode = payload.bypassApproachCode;
    method.methodCode = payload.methodCode;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;

    // TODO: this needs to be the actual user that is logged in
    // how are we going to get this from CDX as this is an id NOT a username
    //method.userId = payload.userId;

    method.updateDate = new Date(Date.now());

    return this.repository.save(method);
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
