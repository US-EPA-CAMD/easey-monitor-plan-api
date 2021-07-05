import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanWorkspaceController } from './monitor-plan.controller';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';

import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';

import { UserCheckOutMap } from 'src/maps/user-check-out.map';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';
import { UserCheckOutRepository } from '../user-check-out/user-check-out.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanWorkspaceRepository,
      MonitorLocationWorkspaceRepository,
      UserCheckOutRepository,
    ]),
  ],
  controllers: [MonitorPlanWorkspaceController],
  providers: [
    MonitorPlanWorkspaceService,
    UserCheckOutService,
    MonitorLocationMap,
    MonitorPlanMap,
    UserCheckOutMap,
  ],
})
export class MonitorPlanWorkspaceModule {}
