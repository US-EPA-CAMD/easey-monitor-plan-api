import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemComponentWorkspaceModule } from '../system-component-workspace/system-component.module';
import { SystemFuelFlowWorkspaceModule } from '../system-fuel-flow-workspace/system-fuel-flow.module';

import { MonitorSystemWorkspaceController } from './monitor-system.controller';
import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';

@Module({
  imports: [
    SystemFuelFlowWorkspaceModule,
    SystemComponentWorkspaceModule,
    TypeOrmModule.forFeature([MonitorSystemWorkspaceRepository]),
  ],
  controllers: [MonitorSystemWorkspaceController],
  providers: [MonitorSystemWorkspaceService, MonitorSystemMap],
  exports: [TypeOrmModule, MonitorSystemWorkspaceService, MonitorSystemMap],
})
export class MonitorSystemWorkspaceModule {}
