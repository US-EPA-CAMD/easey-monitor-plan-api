import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MatsMethod } from '../entities/workspace/mats-method.entity';

@Injectable()
export class MatsMethodWorkspaceRepository extends Repository<MatsMethod> {
  constructor(entityManager: EntityManager) {
    super(MatsMethod, entityManager);
  }

  async getMatsMethodByLogicalKey(
    locationId: string,
    matsMethod: MatsMethodBaseDTO,
  ): Promise<MatsMethod | null> {
    const paramCode = matsMethod.supplementalMATSParameterCode;
    const beginDate = matsMethod.beginDate;
    const beginHour = matsMethod.beginHour;

    return this.createQueryBuilder('mm')
      .where('mm.locationId = :locationId', { locationId })
      .andWhere('mm.supplementalMATSParameterCode = :paramCode', { paramCode })
      .andWhere('mm.beginDate = :beginDate', { beginDate })
      .andWhere('mm.beginHour = :beginHour', { beginHour })
      .getOne();
  }

}
