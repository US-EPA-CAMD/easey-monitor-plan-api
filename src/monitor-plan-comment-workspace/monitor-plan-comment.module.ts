import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorPlanCommentWorkspaceController } from './monitor-plan-comment.controller';
import { MonitorPlanCommentWorkspaceService } from './monitor-plan-comment.service';
import { MonitorPlanCommentWorkspaceRepository } from './monitor-plan-comment.repository';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanCommentWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [MonitorPlanCommentWorkspaceController],
  providers: [MonitorPlanCommentWorkspaceService, MonitorPlanCommentMap],
  exports: [
    TypeOrmModule,
    MonitorPlanCommentWorkspaceService,
    MonitorPlanCommentMap,
  ],
})
export class MonitorPlanCommentWorkspaceModule {}
