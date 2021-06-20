import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanWorkspaceController } from './monitor-plan.controller';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { UnitOpStatusMap } from '../maps/unit-op-status.map';
import { UnitOpStatusRepository } from '../monitor-location/unit-op-status.repository';
import { UnitOpStatusDTO } from '../dtos/unit-op-status.dto';
import { UserCheckOutRepository } from './user-check-out.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanWorkspaceRepository,
      MonitorLocationWorkspaceRepository,
      UnitOpStatusRepository,
      UserCheckOutRepository,
    ]),
  ],
  controllers: [MonitorPlanWorkspaceController],
  providers: [
    MonitorPlanWorkspaceService,
    MonitorLocationMap,
    MonitorPlanMap,
    UnitOpStatusMap,
    UnitOpStatusDTO,
  ],
})
export class MonitorPlanWorkspaceModule {}
