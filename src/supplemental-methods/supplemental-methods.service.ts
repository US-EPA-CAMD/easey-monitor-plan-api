import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';

import { MatsMethodDataDTO } from '../dtos/mats-method-data.dto';
import { MatsMethodRepository } from './supplemental-methods.repository';
import { MatsMethodMap } from '../maps/mats-method-data.map';

@Injectable()
export class SupplementalMethodsService {
  constructor(@InjectRepository(MatsMethodRepository)
    private repository: MatsMethodRepository,
    private map: MatsMethodMap,
  ) {}

  async getMatsMethods(monLocId: string): Promise<MatsMethodDataDTO[]> {
    const findOpts: FindManyOptions = {
      select: [ "id", "matsMethodCode", "matsMethodParameterCode", "beginDate","beginHour","endDate","endHour" ],
      where: { monLocId: monLocId }
    }
    const results = await this.repository.find(findOpts);
    return this.map.many(results);
  }
}
