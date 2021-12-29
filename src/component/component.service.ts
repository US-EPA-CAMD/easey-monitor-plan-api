import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { ComponentDTO } from '../dtos/component.dto';
import { ComponentMap } from '../maps/component.map';
import { ComponentRepository } from './component.repository';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentRepository)
    private repository: ComponentRepository,
    private map: ComponentMap,
    private readonly logger: Logger,
  ) {}

  async getComponents(locationId: string): Promise<ComponentDTO[]> {
    this.logger.info('Getting components');

    let results;
    try {
      results = await this.repository.find({
        where: {
          locationId,
        },
        order: {
          componentId: 'ASC',
        },
      });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got components');

    return this.map.many(results);
  }
}
