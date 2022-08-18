import { Repository, EntityRepository } from 'typeorm';

import { MonitorPlan } from '../entities/monitor-plan.entity';

interface IorisCodesAndLastUpdatedTimes {
  changedOrisCodes: number[];
  mostRecentUpdate: Date;
}

@EntityRepository(MonitorPlan)
export class MonitorPlanRepository extends Repository<MonitorPlan> {
  async getMonitorPlan(planId: string): Promise<MonitorPlan> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant')
      .where('plan.id = :planId', { planId })
      .getOne();
  }

  async getMonitorPlansByOrisCode(orisCode: number): Promise<MonitorPlan[]> {
    return this.createQueryBuilder('plan')
      .innerJoinAndSelect('plan.plant', 'plant', 'plant.orisCode = :orisCode', {
        orisCode: orisCode,
      })
      .getMany();
  }

  async getOrisCodesByLastUpdatedTime(
    queryDate: Date,
  ): Promise<IorisCodesAndLastUpdatedTimes> {
    const planIdsQuery = await this.query(
      'select * from camdecmps.get_oris_codes_for_configurations_last_updated($1)',
      [queryDate],
    );

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
