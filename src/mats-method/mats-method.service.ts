import { Injectable } from '@nestjs/common';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodRepository } from './mats-method.repository';

@Injectable()
export class MatsMethodService {
  constructor(
    private readonly repository: MatsMethodRepository,
    private readonly map: MatsMethodMap,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }
}
