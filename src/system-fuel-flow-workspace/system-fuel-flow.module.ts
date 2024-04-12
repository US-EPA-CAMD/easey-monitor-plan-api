import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemFuelFlowMap } from '../maps/system-fuel-flow.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { SystemFuelFlowWorkspaceController } from './system-fuel-flow.controller';
import { SystemFuelFlowWorkspaceRepository } from './system-fuel-flow.repository';
import { SystemFuelFlowWorkspaceService } from './system-fuel-flow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemFuelFlowWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [SystemFuelFlowWorkspaceController],
  providers: [
    SystemFuelFlowWorkspaceRepository,
    SystemFuelFlowWorkspaceService,
    SystemFuelFlowMap,
  ],
  exports: [
    TypeOrmModule,
    SystemFuelFlowWorkspaceRepository,
    SystemFuelFlowWorkspaceService,
    SystemFuelFlowMap,
  ],
})
export class SystemFuelFlowWorkspaceModule {}
