import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { withTransaction } from '../utils';
import { PlantWorkspaceRepository } from './plant.repository';

@Injectable()
export class PlantWorkspaceService {
  constructor(private readonly repository: PlantWorkspaceRepository) {}

  async getFacilityCommonStackConfigs(orisCode: number, trx?: EntityManager) {
    return withTransaction(this.repository, trx)
      .createQueryBuilder('p')
      .innerJoin('p.units', 'u')
      .innerJoin('u.unitStackConfigurations', 'usc')
      .innerJoin('usc.stackPipe', 'sp')
      .where('p.orisCode = :orisCode', { orisCode })
      .andWhere("sp.name LIKE 'C%'")
      .select('extract(YEAR FROM usc.beginDate)', 'beginYear')
      .addSelect('extract(QUARTER FROM usc.beginDate)', 'beginQuarter')
      .addSelect('extract(YEAR FROM usc.endDate)', 'endYear')
      .addSelect('extract(QUARTER FROM usc.endDate)', 'endQuarter')
      .addSelect(
        "(sp.name || ', ' || string_agg(u.name, ', ' ORDER BY u.name))",
        'locationList',
      )
      .groupBy(
        'extract(YEAR FROM usc.beginDate), extract(QUARTER FROM usc.beginDate), extract(YEAR FROM usc.endDate), extract(QUARTER FROM usc.endDate), sp.name',
      )
      .orderBy(
        'sp.name, extract(YEAR FROM usc.beginDate), extract(QUARTER FROM usc.beginDate), extract(YEAR FROM usc.endDate), extract(QUARTER FROM usc.endDate)',
      )
      .getRawMany();
  }

  async getFacilityMultipleStackConfigs(orisCode: number, trx?: EntityManager) {
    return withTransaction(this.repository, trx)
      .createQueryBuilder('p')
      .innerJoin('p.units', 'u')
      .innerJoin('u.unitStackConfigurations', 'usc')
      .innerJoin('usc.stackPipe', 'sp')
      .where('p.orisCode = :orisCode', { orisCode })
      .andWhere("sp.name LIKE 'M%'")
      .select('extract(YEAR FROM usc.beginDate)', 'beginYear')
      .addSelect('extract(QUARTER FROM usc.beginDate)', 'beginQuarter')
      .addSelect('extract(YEAR FROM usc.endDate)', 'endYear')
      .addSelect('extract(QUARTER FROM usc.endDate)', 'endQuarter')
      .addSelect(
        "(string_agg(sp.name, ', ' ORDER BY sp.name) || ', ' || u.name)",
        'locationList',
      )
      .groupBy(
        'extract(YEAR FROM usc.beginDate), extract(QUARTER FROM usc.beginDate), extract(YEAR FROM usc.endDate), extract(QUARTER FROM usc.endDate), unit.name',
      )
      .orderBy(
        'unit.name, extract(YEAR FROM usc.beginDate), extract(QUARTER FROM usc.beginDate), extract(YEAR FROM usc.endDate), extract(QUARTER FROM usc.endDate)',
      )
      .getRawMany();
  }

  async getFacilityUnitConfigs(orisCode: number, trx?: EntityManager) {
    return withTransaction(this.repository, trx).createQueryBuilder('p');
  }
}
