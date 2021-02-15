import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { UnitOpStatusMap } from 'src/maps/unit-op-status.map';
import { UnitOpStatusRepository } from 'src/monitor-location/unit-op-status.repository';
import { UnitOpStatusDTO } from 'src/dtos/unit-op-status.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanRepository,
      MonitorLocationRepository,
      UnitOpStatusRepository
    ])
  ],
  controllers: [
    MonitorPlanController
  ],
  providers: [
    MonitorPlanService,
    MonitorLocationMap,
    MonitorPlanMap,
    UnitOpStatusMap,
    UnitOpStatusDTO
  ],
})
export class MonitorPlanModule {}
