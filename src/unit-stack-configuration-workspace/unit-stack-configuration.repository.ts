import { EntityRepository, Repository } from 'typeorm';

import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';

@EntityRepository(UnitStackConfiguration)
export class UnitStackConfigurationWorkspaceRepository extends Repository<
  UnitStackConfiguration
> {
  async getUnitStackById(id: string) {
    return this.createQueryBuilder('usc')
      .where('usc.id = :id', { id })
      .getOne();
  }

  async getUnitStackByUnitIdStackIdBDate(
    unitRecordId: number,
    stackPipeRecordId: string,
    beginDate: Date,
  ): Promise<UnitStackConfiguration> {
    return this.createQueryBuilder('usc')
      .where('usc.unitId = :unitRecordId', { unitRecordId })
      .andWhere('usc.stackPipeId = :stackPipeRecordId', { stackPipeRecordId })
      .andWhere('usc.beginDate = :beginDate', { beginDate })
      .getOne();
  }

  async getUnitStackConfigsByLocationIds(locationIds: string) {
    return this.createQueryBuilder('usc')
      .innerJoin('usc.unit', 'u')
      .innerJoin('usc.stackPipe', 'sp')
      .innerJoin('usc.location', 'mlu')
      .innerJoin('usc.location', 'mlsp')
      .where('mlu.locationId IN (:...locationIds)', { locationIds })
      .where('msp.locationId IN (:...locationIds)', { locationIds })
      .getMany();
  }
}
