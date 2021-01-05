import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationMap } from 'src/maps/monitor-location.map';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from 'src/monitor-location/monitor-location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanRepository,
      MonitorLocationRepository,
    ])
  ],
  controllers: [
    MonitorPlanController
  ],
  providers: [
    MonitorPlanService,
    MonitorLocationMap,
    MonitorPlanMap,
  ],
})
export class MonitorPlanModule {}
