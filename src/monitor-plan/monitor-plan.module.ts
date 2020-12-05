import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanRepository } from './monitor-plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanRepository])],
  controllers: [MonitorPlanController],
  providers: [MonitorPlanService],
})
export class MonitorPlanModule {}
