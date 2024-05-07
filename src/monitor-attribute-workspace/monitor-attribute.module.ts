import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorAttributeMap } from 'src/maps/monitor-attribute.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorAttributeWorkspaceController } from './monitor-attribute.controller';
import { MonitorAttributeWorkspaceRepository } from './monitor-attribute.repository';
import { MonitorAttributeWorkspaceService } from './monitor-attribute.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorAttributeWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorAttributeWorkspaceController],
  providers: [
    MonitorAttributeWorkspaceRepository,
    MonitorAttributeWorkspaceService,
    MonitorAttributeMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorAttributeWorkspaceRepository,
    MonitorAttributeWorkspaceService,
    MonitorAttributeMap,
  ],
})
export class MonitorAttributeWorkspaceModule {}
