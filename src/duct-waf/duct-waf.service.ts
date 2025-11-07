import { Injectable } from '@nestjs/common';

import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafRepository } from './duct-waf.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
import { DataSource } from 'typeorm';

@Injectable()
export class DuctWafService {
  constructor(
    private readonly map: DuctWafMap,
    private readonly dataSource: DataSource,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    const results = await useSlaveRepository(this.dataSource, DuctWafRepository, async (repository) => repository.findBy({ locationId }));
    return this.map.many(results);
  }
}
