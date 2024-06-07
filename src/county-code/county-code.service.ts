import { Injectable } from '@nestjs/common';

import { CountyCodeMap } from '../maps/county-code.map';
import { CountyCodeRepository } from './county-code.repository';

@Injectable()
export class CountyCodeService {
  constructor(
    private readonly repository: CountyCodeRepository,
    private readonly map: CountyCodeMap,
  ) {}

  async getCountyCode(countyCode: string) {
    const result = await this.repository.findOneBy({ countyCode });

    return this.map.one(result);
  }
}
