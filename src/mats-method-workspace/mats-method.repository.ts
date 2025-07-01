import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MatsMethod } from '../entities/workspace/mats-method.entity';

@Injectable()
export class MatsMethodWorkspaceRepository extends Repository<MatsMethod> {
  constructor(entityManager: EntityManager) {
    super(MatsMethod, entityManager);
  }

  async getMatsMethodByLocIdParamCodeBeginOrEndDate(
    locationId: string,
    matsMethod: MatsMethodBaseDTO,
  ): Promise<MatsMethod | null> {
    const paramCode = matsMethod.supplementalMATSParameterCode;
    const beginDate = matsMethod.beginDate;
    const beginHour = matsMethod.beginHour;
    const endDate = matsMethod.endDate;
    const endHour = matsMethod.endHour;

    const query = this.createQueryBuilder('mm')
      .where('mm.locationId = :locationId', { locationId })
      .andWhere('mm.supplementalMATSParameterCode = :paramCode', { paramCode })
      .andWhere('(mm.beginDate = :beginDate AND mm.beginHour = :beginHour)', {
        beginDate,
        beginHour,
      });

    const beginMatch = await query.getOne();
    if (beginMatch) return beginMatch;

    if (endDate !== null && endHour !== null) {
      const endQuery = this.createQueryBuilder('mm')
        .where('mm.locationId = :locationId', { locationId })
        .andWhere('mm.supplementalMATSParameterCode = :paramCode', { paramCode })
        .andWhere('(mm.endDate = :endDate AND mm.endHour = :endHour)', {
          endDate,
          endHour,
        });

      const endMatch = await endQuery.getOne();
      if (endMatch) return endMatch;
    }

    return null;
  }

}
