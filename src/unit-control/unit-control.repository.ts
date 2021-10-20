import { EntityRepository, Repository } from 'typeorm';

import { UnitControl } from '../entities/unit-control.entity';

@EntityRepository(UnitControl)
export class UnitControlRepository extends Repository<UnitControl> {
  async getUnitControls(
    locId: string,
    unitRecordId: number,
  ): Promise<UnitControl[]> {
    return this.createQueryBuilder('uc')
      .innerJoinAndSelect('uc.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .getMany();
  }
}
