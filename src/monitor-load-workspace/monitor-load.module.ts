import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLoadWorkspaceController } from './monitor-load.controller';
import { MonitorLoadWorkspaceService } from './monitor-load.service';
import { MonitorLoadWorkspaceRepository } from './monitor-load.repository';
import { MonitorLoadMap } from '../maps/monitor-load.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLoadWorkspaceRepository])],
  controllers: [MonitorLoadWorkspaceController],
  providers: [MonitorLoadWorkspaceService, MonitorLoadMap],
  exports: [TypeOrmModule, MonitorLoadWorkspaceService, MonitorLoadMap],
})
export class MonitorLoadWorkspaceModule {}
