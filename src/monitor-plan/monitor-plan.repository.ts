import { LastUpdatedConfigBaseDTO } from '../dtos/last-updated-config-base.dto';
import { Repository, EntityRepository } from 'typeorm';

import { MonitorPlan } from '../entities/monitor-plan.entity';

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
  ): Promise<LastUpdatedConfigBaseDTO> {
    const planIdsQuery = await this.query(
      'select * from camdecmps.last_updated_unit_stack_oris_codes($1)',
      [queryDate],
    );

    let orisCodes = [];

    planIdsQuery.forEach(obj => {
      orisCodes.push(obj['oris_code']);
    });

    orisCodes = [...new Set(orisCodes)];

    const dto = new LastUpdatedConfigBaseDTO();

    dto.changedOrisCodes = orisCodes;
    dto.mostRecentUpdate = planIdsQuery[0]['last_updated_time'];

    return dto;
  }
}
