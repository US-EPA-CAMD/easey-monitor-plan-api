import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorLoadWorkspaceController } from './monitor-load.controller';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorLoadWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorLoadWorkspaceController],
  providers: [MonitorLoadWorkspaceService, MonitorLoadMap],
  exports: [TypeOrmModule, MonitorLoadWorkspaceService, MonitorLoadMap],
})
export class MonitorLoadWorkspaceModule {}
