import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodRepository } from './mats-method.repository';

@Injectable()
export class MatsMethodService {
  constructor(
    @InjectRepository(MatsMethodRepository)
    private readonly repository: MatsMethodRepository,
    private readonly map: MatsMethodMap,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
