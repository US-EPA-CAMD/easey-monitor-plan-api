import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { SystemComponentWorkspaceModule } from '../system-component-workspace/system-component.module';
import { SystemFuelFlowWorkspaceModule } from '../system-fuel-flow-workspace/system-fuel-flow.module';

import { MonitorSystemWorkspaceController } from './monitor-system.controller';
import { MonitorSystemWorkspaceService } from './monitor-system.service';
import { MonitorSystemWorkspaceRepository } from './monitor-system.repository';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { MonitorSystemCheckService } from './monitor-system-checks.service';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';

@Module({
  imports: [
    ComponentWorkspaceModule,
    SystemFuelFlowWorkspaceModule,
    SystemComponentWorkspaceModule,
    TypeOrmModule.forFeature([
      MonitorSystemWorkspaceRepository,
      UsedIdentifierRepository,
    ]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorSystemWorkspaceController],
  providers: [
    MonitorSystemWorkspaceService,
    MonitorSystemMap,
    MonitorSystemCheckService,
  ],
  exports: [
    TypeOrmModule,
    MonitorSystemWorkspaceService,
    MonitorSystemMap,
    MonitorSystemCheckService,
  ],
})
export class MonitorSystemWorkspaceModule {}
