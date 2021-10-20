import { EntityRepository, Repository } from 'typeorm';
import { UnitControl } from '../entities/workspace/unit-control.entity';

@EntityRepository(UnitControl)
export class UnitControlWorkspaceRepository extends Repository<UnitControl> {
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
  async getUnitControl(
    locId: string,
    unitRecordId: number,
    unitControlId: string,
  ): Promise<UnitControl> {
    return this.createQueryBuilder('uf')
      .innerJoinAndSelect('uf.unit', 'u')
      .innerJoinAndSelect('u.location', 'l')
      .where('l.id = :locId', { locId })
      .andWhere('u.id = :unitRecordId', { unitRecordId })
      .andWhere('uf.id = :unitControlId', { unitControlId })
      .getOne();
  }
}
