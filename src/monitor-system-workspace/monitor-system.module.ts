import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { SystemComponentWorkspaceModule } from '../system-component-workspace/system-component.module';
import { SystemFuelFlowWorkspaceModule } from '../system-fuel-flow-workspace/system-fuel-flow.module';
import { UsedIdentifierModule } from '../used-identifier/used-identifier.module';
import { MonitorSystemCheckService } from './monitor-system-checks.service';
import { MonitorSystemWorkspaceController } from './monitor-system.controller';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorSystemWorkspaceService } from './monitor-system.service';

@Module({
  imports: [
    ComponentWorkspaceModule,
    SystemFuelFlowWorkspaceModule,
    SystemComponentWorkspaceModule,
    TypeOrmModule.forFeature([MonitorSystemWorkspaceRepository]),
    HttpModule,
    UsedIdentifierModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorSystemWorkspaceController],
  providers: [
    MonitorSystemWorkspaceRepository,
    MonitorSystemWorkspaceService,
    MonitorSystemMap,
    MonitorSystemCheckService,
  ],
  exports: [
    TypeOrmModule,
    MonitorSystemWorkspaceRepository,
    MonitorSystemWorkspaceService,
    MonitorSystemMap,
    MonitorSystemCheckService,
  ],
})
export class MonitorSystemWorkspaceModule {}
