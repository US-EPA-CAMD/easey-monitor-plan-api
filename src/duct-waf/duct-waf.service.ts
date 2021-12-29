import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafRepository } from './duct-waf.repository';

@Injectable()
export class DuctWafService {
  constructor(
    @InjectRepository(DuctWafRepository)
    private repository: DuctWafRepository,
    private map: DuctWafMap,
    private readonly logger: Logger,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    this.logger.info('Getting duct wafs');

    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got duct wafs');

    return this.map.many(result);
  }
}
