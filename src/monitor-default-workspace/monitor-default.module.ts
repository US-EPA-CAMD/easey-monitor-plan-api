import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorDefaultWorkspaceController } from './monitor-default.controller';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';
import { MonitorDefaultMap } from '../maps/monitor-default.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorDefaultWorkspaceRepository])],
  controllers: [MonitorDefaultWorkspaceController],
  providers: [MonitorDefaultWorkspaceService, MonitorDefaultMap],
  exports: [TypeOrmModule, MonitorDefaultWorkspaceService, MonitorDefaultMap],
})
export class MonitorDefaultWorkspaceModule {}
