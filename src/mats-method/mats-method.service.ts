import { Injectable } from '@nestjs/common';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodRepository } from './mats-method.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class MatsMethodService {
  constructor(
    private readonly map: MatsMethodMap,
    private readonly dataSource: DataSource,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    const results = await useSlaveRepository(this.dataSource, MatsMethodRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
