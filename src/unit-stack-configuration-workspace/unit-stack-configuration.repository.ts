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
}
