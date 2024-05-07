import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorDefaultMap } from '../maps/monitor-default.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorDefaultWorkspaceController } from './monitor-default.controller';
import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorDefaultWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorDefaultWorkspaceController],
  providers: [
    MonitorDefaultWorkspaceRepository,
    MonitorDefaultWorkspaceService,
    MonitorDefaultMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorDefaultWorkspaceRepository,
    MonitorDefaultWorkspaceService,
    MonitorDefaultMap,
  ],
})
export class MonitorDefaultWorkspaceModule {}
