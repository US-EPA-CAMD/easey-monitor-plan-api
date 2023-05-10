import { EntityRepository, Repository } from 'typeorm';
import { MatsMethodBaseDTO } from '../dtos/mats-method.dto';
import { MatsMethod } from '../entities/workspace/mats-method.entity';

@EntityRepository(MatsMethod)
export class MatsMethodWorkspaceRepository extends Repository<MatsMethod> {
  async getMatsMethodByLodIdParamCodeAndDate(
    locationId: string,
    matsMethod: MatsMethodBaseDTO,
  ): Promise<MatsMethod> {
    const paramCode = matsMethod.supplementalMATSParameterCode;
    const beginDate = matsMethod.beginDate;
    const beginHour = matsMethod.beginHour;
    const endDate = matsMethod.endDate;
    const endHour = matsMethod.endHour;

    return this.createQueryBuilder('mm')
      .where('mm.locationId = :locationId', {
        locationId,
      })
      .andWhere('mm.supplementalMATSParameterCode = :paramCode', {
        paramCode,
      })
      .andWhere(`((
          mm.beginDate = :beginDate AND mm.beginHour = :beginHour
        ) OR (
          mm.endDate IS NOT NULL AND mm.endDate = :endDate AND mm.endHour = :endHour
        ))`,
        {
          beginDate,
          beginHour,
          endDate,
          endHour,
        },
      )
      .getOne();
  }
}
