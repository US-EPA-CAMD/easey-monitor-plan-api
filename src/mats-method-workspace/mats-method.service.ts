import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { MatsMethodWorkspaceRepository } from './mats-method.repository';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { CreateMatsMethodDTO } from '../dtos/create-mats-method.dto';
import { UpdateMatsMethodDTO } from '../dtos/update-mats-method.dto';

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
    payload: CreateMatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    const method = this.repository.create({
      id: uuid(),
      monLocId,
      matsMethodCode: payload.matsMethodCode,
      matsMethodParameterCode: payload.matsMethodParameterCode,
      beginDate: payload.beginDate,
      beginHour: payload.beginHour,
      endDate: payload.endDate,
      endHour: payload.endHour,

      // TODO: userId to be determined
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(method);
    return this.map.one(result);
  }

  async updateMethod(
    methodId: string,
    monLocId: string,
    payload: UpdateMatsMethodDTO,
  ): Promise<MatsMethodDTO> {
    const method = await this.getMethod(methodId);

    method.monLocId = monLocId;
    method.beginDate = payload.beginDate;
    method.beginHour = payload.beginHour;
    method.endDate = payload.endDate;
    method.endHour = payload.endHour;

    // TODO: userId to be determined
    method.userId = 'testuser';
    method.updateDate = new Date(Date.now());

    const result = await this.repository.save(method);
    return this.map.one(result);
  }
}
