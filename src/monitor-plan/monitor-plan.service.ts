import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanParamsDTO } from './dto/monitor-plan-params.dto';
import { MonitorPlanDTO } from './dto/monitor-plan.dto';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private monitorPlanRepository: MonitorPlanRepository,
  ) {}

  getMonitorPlan(monitorPlanParamsDTO: MonitorPlanParamsDTO): MonitorPlanDTO[] {
    return this.monitorPlanRepository.getMonitorPlan(monitorPlanParamsDTO);
  }
}
