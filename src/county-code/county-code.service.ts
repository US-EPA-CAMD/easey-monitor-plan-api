import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CountyCodeMap } from '../maps/county-code.map';
import { CountyCodeRepository } from './county-code.repository';

@Injectable()
export class CountyCodeService {
  constructor(
    @InjectRepository(CountyCodeRepository)
    private readonly repository: CountyCodeRepository,
    private readonly map: CountyCodeMap,
    private readonly logger: Logger,
  ) {}

  async getCountyCode(countyCode: string) {
    this.logger.info('Getting county code');

    let result;
    try {
      result = await this.repository.findOne(countyCode);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got county code');

    return this.map.one(result);
  }
}
