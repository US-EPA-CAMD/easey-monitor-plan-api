import { Module } from '@nestjs/common';
import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanService } from './monitor-plan.service';

@Module({
  controllers: [MonitorPlanController],
  providers: [MonitorPlanService]
})
export class MonitorPlanModule {}
