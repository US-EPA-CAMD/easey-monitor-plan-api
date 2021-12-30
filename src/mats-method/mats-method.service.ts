import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { MatsMethodDTO } from '../dtos/mats-method.dto';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MatsMethodRepository } from './mats-method.repository';

@Injectable()
export class MatsMethodService {
  constructor(
    @InjectRepository(MatsMethodRepository)
    private repository: MatsMethodRepository,
    private map: MatsMethodMap,
    private readonly logger: Logger,
  ) {}

  async getMethods(locationId: string): Promise<MatsMethodDTO[]> {
    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.map.many(result);
  }
}
