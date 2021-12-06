import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountyCodeMap } from '../maps/county-code.map';
import { CountyCodeRepository } from './county-code.repository';

@Injectable()
export class CountyCodeService {
  constructor(
    @InjectRepository(CountyCodeRepository)
    private readonly repository: CountyCodeRepository,
    private readonly map: CountyCodeMap,
  ) {}

  async getCountyCode(countyCode: string) {
    const result = await this.repository.findOne(countyCode);

    return this.map.one(result);
  }
}
