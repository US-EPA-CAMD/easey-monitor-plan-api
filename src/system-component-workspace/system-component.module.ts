import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { SystemComponentMap } from '../maps/system-component.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { SystemComponentWorkspaceController } from './system-component.controller';
import { SystemComponentWorkspaceRepository } from './system-component.repository';
import { SystemComponentWorkspaceService } from './system-component.service';

@Module({
  imports: [
    ComponentWorkspaceModule,
    TypeOrmModule.forFeature([SystemComponentWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [SystemComponentWorkspaceController],
  providers: [
    SystemComponentWorkspaceRepository,
    SystemComponentWorkspaceService,
    SystemComponentMap,
  ],
  exports: [
    TypeOrmModule,
    SystemComponentWorkspaceRepository,
    SystemComponentWorkspaceService,
    SystemComponentMap,
  ],
})
export class SystemComponentWorkspaceModule {}
