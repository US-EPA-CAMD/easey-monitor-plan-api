import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanParamsDTO } from './dto/monitor-plan-params.dto';
import { MonitorPlanDTO } from './dto/monitor-plan.dto';

@Injectable()
export class MonitorPlanService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(MonitorPlanRepository) private monitorPlanRepository: MonitorPlanRepository
  ) {}

  getMonitorPlan(monitorPlanParamsDTO: MonitorPlanParamsDTO): MonitorPlanDTO[] {
    console.log(`${this.configService.get('app.uri')}/monitor-plans`);    
    return this.monitorPlanRepository.getMonitorPlan(monitorPlanParamsDTO);
  }
}
