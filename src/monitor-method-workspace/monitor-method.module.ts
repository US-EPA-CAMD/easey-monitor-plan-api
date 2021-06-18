import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorMethodWorkspaceController } from './monitor-method.controller';
import { MonitorMethodWorkspaceService } from './monitor-method.service';
import { MonitorMethodWorkspaceRepository } from './monitor-method.repository';

import { MonitorMethodMap } from '../maps/monitor-method.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorMethodWorkspaceRepository]),
  ],
  controllers: [
    MonitorMethodWorkspaceController,
  ],
  providers: [
    MonitorMethodMap,
    MonitorMethodWorkspaceService,
  ],
})

export class MonitorMethodWorkspaceModule {}
