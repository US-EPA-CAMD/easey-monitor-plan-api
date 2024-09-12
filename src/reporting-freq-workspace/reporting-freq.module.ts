import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { ReportingFreqWorkspaceRepository } from './reporting-freq.repository';
import { ReportingFreqWorkspaceController } from './reporting-freq.controller';
import { ReportingFreqWorkspaceService } from './reporting-freq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportingFreqWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [ReportingFreqWorkspaceController],
  providers: [
    ReportingFreqWorkspaceRepository,
    ReportingFreqWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    ReportingFreqWorkspaceRepository,
    ReportingFreqWorkspaceService,
  ],
})
export class ReportingFreqWorkspaceModule {}
