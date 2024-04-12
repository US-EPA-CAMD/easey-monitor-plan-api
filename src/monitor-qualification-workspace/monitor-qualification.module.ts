import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CPMSQualificationWorkspaceModule } from '../cpms-qualification-workspace/cpms-qualification-workspace.module';
import { LEEQualificationWorkspaceModule } from '../lee-qualification-workspace/lee-qualification.module';
import { LMEQualificationWorkspaceModule } from '../lme-qualification-workspace/lme-qualification.module';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { PCTQualificationWorkspaceModule } from '../pct-qualification-workspace/pct-qualification.module';
import { MonitorQualificationWorkspaceController } from './monitor-qualification.controller';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';

@Module({
  imports: [
    LEEQualificationWorkspaceModule,
    LMEQualificationWorkspaceModule,
    TypeOrmModule.forFeature([MonitorQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => CPMSQualificationWorkspaceModule),
    forwardRef(() => PCTQualificationWorkspaceModule),
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorQualificationWorkspaceController],
  providers: [
    MonitorQualificationWorkspaceRepository,
    MonitorQualificationWorkspaceService,
    MonitorQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorQualificationWorkspaceRepository,
    MonitorQualificationWorkspaceService,
    MonitorQualificationMap,
  ],
})
export class MonitorQualificationWorkspaceModule {}
