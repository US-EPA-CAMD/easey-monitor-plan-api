import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodMap } from '../maps/workspace/mats-method.map';

@Injectable()
export class MatsMethodWorkspaceService {
  constructor(
    @InjectRepository(MatsMethodWorkspaceRepository)
    private repository: MatsMethodWorkspaceRepository,
    private map: MatsMethodMap,
  ) {}

  async getMethods(monLocId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.find({ monLocId });
    return this.map.many(results);
  }

  async getMethod(methodId: string): Promise<MatsMethodDTO> {
    const result = await this.repository.findOne(methodId);

    if (!result) {
      throw new NotFoundException('Mats Method not found.');
    }
    return this.map.one(result);
  }

  async createMethod(
    monLocId: string,
    payload: MatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    const method = await this.repository.create({
      monLocId,
      matsMethodCode: payload.matsMethodCode,
      matsMethodParameterCode: payload.matsMethodParameterCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,
    });

    const result = await this.repository.save(method);
    return this.map.one(result);
  }

  async updateMethod(
    methodId: string,
    payload: MatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    const method = await this.getMethod(methodId);

    method.monLocId = payload.monLocId;
    method.matsMethodCode = payload.matsMethodCode;
    method.matsMethodParameterCode = payload.matsMethodParameterCode;
    method.beginDate = payload.beginDate;
    method.beginHour = payload.beginHour;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;

    // TODO: find out about user payload
    method['userId'] = 'testuser';
    method['updateDate'] = new Date(Date.now());

    const result = await this.repository.save(method);
    return this.map.one(result);
  }
}
