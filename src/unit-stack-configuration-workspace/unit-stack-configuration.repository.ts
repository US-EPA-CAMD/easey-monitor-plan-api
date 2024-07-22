import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';

import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';

@Injectable()
export class UnitStackConfigurationWorkspaceRepository extends Repository<
  UnitStackConfiguration
> {
  constructor(entityManager: EntityManager) {
    super(UnitStackConfiguration, entityManager);
  }

  async getUnitStackById(id: string) {
    return this.createQueryBuilder('usc')
      .where('usc.id = :id', { id })
      .getOne();
  }

  async getUnitStacksByIds(ids: string[]) {
    return this.findBy({
      id: In(ids),
    });
  }

  async getUnitStackConfigByUnitIdStackId(
    unitRecordId: number,
    stackPipeRecordId: string,
  ): Promise<UnitStackConfiguration> {
    return this.createQueryBuilder('usc')
      .where('usc.unitId = :unitRecordId', { unitRecordId })
      .andWhere('usc.stackPipeId = :stackPipeRecordId', { stackPipeRecordId })
      .getOne();
  }

  async getUnitStackConfigsByLocationIds(locationIds: string[]) {
    if (locationIds.length === 0) return [];

    return this.createQueryBuilder('usc')
      .innerJoinAndSelect('usc.unit', 'u')
      .innerJoinAndSelect('usc.stackPipe', 'sp')
      .innerJoin('u.location', 'mlu')
      .innerJoin('sp.location', 'mlsp')
      .where('mlu.id IN (:...locationIds)', { locationIds })
      .andWhere('mlsp.id IN (:...locationIds)', { locationIds })
      .getMany();
  }

  async getUnitStackConfigsByUnitId(id: number | string, isUnit: boolean) {
    const query = this.createQueryBuilder('usc')
      .innerJoinAndSelect('usc.unit', 'u')
      .innerJoinAndSelect('usc.stackPipe', 'sp');
    if (isUnit) {
      query.where('u.id = :id', { id });
    } else {
      query.where('sp.id = :id', { id });
    }
    return query.getMany();
  }
}
