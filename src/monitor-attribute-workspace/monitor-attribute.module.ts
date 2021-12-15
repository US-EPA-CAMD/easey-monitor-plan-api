import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeWorkspaceController } from './monitor-attribute.controller';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorAttributeMap } from '../maps/montitor-attribute.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorAttributeWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorAttributeWorkspaceController],
  providers: [MonitorAttributeWorkspaceService, MonitorAttributeMap],
  exports: [
    TypeOrmModule,
    MonitorAttributeWorkspaceService,
    MonitorAttributeMap,
  ],
})
export class MonitorAttributeWorkspaceModule {}
