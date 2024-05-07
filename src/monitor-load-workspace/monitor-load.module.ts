import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorLoadWorkspaceController } from './monitor-load.controller';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { MonitorLoadWorkspaceService } from './monitor-load.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorLoadWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorLoadWorkspaceController],
  providers: [
    MonitorLoadWorkspaceRepository,
    MonitorLoadWorkspaceService,
    MonitorLoadMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorLoadWorkspaceRepository,
    MonitorLoadWorkspaceService,
    MonitorLoadMap,
  ],
})
export class MonitorLoadWorkspaceModule {}
