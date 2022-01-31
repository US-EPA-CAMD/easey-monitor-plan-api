import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafRepository } from './duct-waf.repository';

@Injectable()
export class DuctWafService {
  constructor(
    @InjectRepository(DuctWafRepository)
    private readonly repository: DuctWafRepository,
    private readonly map: DuctWafMap,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }
}
