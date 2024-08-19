import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';

import { MonitorPlan as MonitorPlanWorkspace } from '../entities/workspace/monitor-plan.entity';
import { UnitStackConfiguration } from '../entities/workspace/unit-stack-configuration.entity';

@Injectable()
export class UnitStackConfigurationWorkspaceRepository extends Repository<
  UnitStackConfiguration
> {
  constructor(entityManager: EntityManager) {
    super(UnitStackConfiguration, entityManager);
  }

  async getUnitStackById(id: string) {
    return this.findOne({
      where: { id },
      relations: {
        stackPipe: true,
        unit: true,
      },
    });
  }

  async getUnitStacksByIds(ids: string[]) {
    return this.find({
      relations: {
        stackPipe: true,
        unit: true,
      },
      where: {
        id: In(ids),
      },
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

  async getUnitStackConfigsByMonitorPlanId(planId: string) {
    return this.createQueryBuilder('usc')
      .innerJoinAndSelect('usc.unit', 'u')
      .innerJoinAndSelect('usc.stackPipe', 'sp')
      .innerJoin('u.location', 'u_ml')
      .innerJoin('sp.location', 'sp_ml')
      .innerJoin('u_ml.plans', 'u_mp')
      .innerJoin('sp_ml.plans', 'sp_mp')
      .innerJoin('u_mp.beginReportingPeriod', 'u_brp')
      .innerJoin('sp_mp.beginReportingPeriod', 'sp_brp')
      .leftJoin('u_mp.endReportingPeriod', 'u_erp')
      .leftJoin('sp_mp.endReportingPeriod', 'sp_erp')
      .where('u_mp.id = :planId', { planId })
      .andWhere('sp_mp.id = :planId', { planId })
      .andWhere('usc.beginDate <= u_brp.endDate')
      .andWhere('usc.beginDate <= sp_brp.endDate')
      .andWhere('(usc.endDate IS NULL OR usc.endDate >= u_erp.beginDate)')
      .andWhere('(usc.endDate IS NULL OR usc.endDate >= sp_erp.beginDate)')
      .getMany();
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
