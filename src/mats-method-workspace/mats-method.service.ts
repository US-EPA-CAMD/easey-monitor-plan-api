import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MatsMethodRepository } from './mats-method.repository';
import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodMap } from '../maps/mats-method.map';

@Injectable()
export class MatsMethodService {
  constructor(
    @InjectRepository(MatsMethodRepository)
    private repository: MatsMethodRepository,
    private map: MatsMethodMap,
  ) {}

  async getMethods(monLocId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.find({ monLocId });
    return this.map.many(results);
  }

  async createMatsMethod(
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
}
