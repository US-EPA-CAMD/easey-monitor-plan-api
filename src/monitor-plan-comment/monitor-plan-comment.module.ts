import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanCommentController } from './monitor-plan-comment.controller';
import { MonitorPlanCommentService } from './monitor-plan-comment.service';
import { MonitorPlanCommentRepository } from './monitor-plan-comment.repository';
import { MonitorPlanCommentMap } from '../maps/monitor-plan-comment.map';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanCommentRepository])],
  controllers: [MonitorPlanCommentController],
  providers: [
    MonitorPlanCommentRepository,
    MonitorPlanCommentService,
    MonitorPlanCommentMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorPlanCommentRepository,
    MonitorPlanCommentService,
    MonitorPlanCommentMap,
  ],
})
export class MonitorPlanCommentModule {}
