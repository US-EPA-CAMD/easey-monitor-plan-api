import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MatsMethod } from '../entities/workspace/mats-method.entity';

@Injectable()
export class MatsMethodWorkspaceRepository extends Repository<MatsMethod> {
  constructor(entityManager: EntityManager) {
    super(MatsMethod, entityManager);
  }

  async getMatsMethodByLodIdParamCodeAndDate(
    locationId: string,
    matsMethod: MatsMethodBaseDTO,
  ): Promise<MatsMethod> {
    const paramCode = matsMethod.supplementalMATSParameterCode;
    const beginDate = matsMethod.beginDate;
    const beginHour = matsMethod.beginHour;
    const endDate = matsMethod.endDate;
    const endHour = matsMethod.endHour;

    const query =  this.createQueryBuilder('mm')
      .where('mm.locationId = :locationId', {
        locationId,
      })
      .andWhere('mm.supplementalMATSParameterCode = :paramCode', {
        paramCode,
      })
      .andWhere(
        `(mm.beginDate = :beginDate AND mm.beginHour = :beginHour)`,
        { beginDate, beginHour }
      )

      if (endDate !== null && endHour !== null) {
        query.andWhere(
          '(mm.endDate = :endDate AND mm.endHour = :endHour)',
          { endDate, endHour }
        );
      } else {
        query.andWhere('mm.endDate IS NULL AND mm.endHour IS NULL');
      }

    return query.getOne();
  }
}
