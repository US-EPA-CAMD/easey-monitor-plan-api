import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorDefaultWorkspaceController } from './monitor-default.controller';
import { MonitorDefaultWorkspaceService } from './monitor-default.service';
import { MonitorDefaultWorkspaceRepository } from './monitor-default.repository';
import { MonitorDefaultMap } from '../maps/monitor-default.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorDefaultWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [MonitorDefaultWorkspaceController],
  providers: [MonitorDefaultWorkspaceService, MonitorDefaultMap],
  exports: [TypeOrmModule, MonitorDefaultWorkspaceService, MonitorDefaultMap],
})
export class MonitorDefaultWorkspaceModule {}
