import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceController } from './monitor-plan-comment.controller';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanCommentWorkspaceRepository]),
    TypeOrmModule.forFeature([MonitorPlanWorkspaceRepository]),
    forwardRef(() => MonitorPlanWorkspaceModule),
    HttpModule,
  ],
  controllers: [MonitorPlanCommentWorkspaceController],
  providers: [
    MonitorPlanWorkspaceRepository,
    MonitorPlanCommentWorkspaceRepository,
    MonitorPlanCommentWorkspaceService,
    MonitorPlanCommentMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorPlanCommentWorkspaceRepository,
    MonitorPlanCommentWorkspaceService,
    MonitorPlanCommentMap,
  ],
})
export class MonitorPlanCommentWorkspaceModule {}
