import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';
import { MonitorPlanCommentWorkspaceController } from './monitor-plan-comment.controller';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanCommentWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [MonitorPlanCommentWorkspaceController],
  providers: [
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
