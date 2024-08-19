import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';

import { MonitorPlan } from '../entities/monitor-plan.entity';
import { UnitStackConfiguration } from '../entities/unit-stack-configuration.entity';

interface IorisCodesAndLastUpdatedTimes {
  changedOrisCodes: number[];
  mostRecentUpdate: Date;
}

@Injectable()
export class MonitorPlanRepository extends Repository<MonitorPlan> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlan, entityManager);
  }

  async getMonitorPlan(planId: string): Promise<MonitorPlan> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant')
      .where('plan.id = :planId', { planId })
      .getOne();
  }

  async getMonitorPlanByIds(planIds: string[]): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant')
      .where('plan.id IN (:...planIds)', { planIds })
      .getMany();
  }

  async getMonitorPlansByOrisCode(orisCode: number): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant', 'plant.orisCode = :orisCode', {
        orisCode: orisCode,
      })
      .getMany();
  }

  async getMonitorPlansByOrisCodes(
    orisCodes: number[],
  ): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect(
        'plan.plant',
        'plant',
        'plant.orisCode IN (:...orisCodes)',
        {
          orisCodes,
        },
      )
      .getMany();
  }

  async getOrisCodesByLastUpdatedTime(
    queryDate: string,
  ): Promise<IorisCodesAndLastUpdatedTimes> {
    const planIdsQuery = await this.query(
      'select * from camdecmps.get_oris_codes_for_configurations_last_updated($1)',
      [queryDate],
    );

    console.log(planIdsQuery);

    if (planIdsQuery.length === 0) {
      return {
        changedOrisCodes: [],
        mostRecentUpdate: null,
      };
    }

    let orisCodes = [];

    planIdsQuery.forEach(obj => {
      orisCodes.push(obj['oris_code']);
    });

    orisCodes = [...new Set(orisCodes)];

    return {
      changedOrisCodes: orisCodes,
      mostRecentUpdate: planIdsQuery[0]['last_updated_time'],
    };
  }
}
