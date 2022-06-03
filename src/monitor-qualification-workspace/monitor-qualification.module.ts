import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { LEEQualificationWorkspaceModule } from '../lee-qualification-workspace/lee-qualification.module';
import { LMEQualificationWorkspaceModule } from '../lme-qualification-workspace/lme-qualification.module';
import { PCTQualificationWorkspaceModule } from '../pct-qualification-workspace/pct-qualification.module';

import { MonitorQualificationWorkspaceController } from './monitor-qualification.controller';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [
    LEEQualificationWorkspaceModule,
    LMEQualificationWorkspaceModule,
    PCTQualificationWorkspaceModule,
    TypeOrmModule.forFeature([MonitorQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [MonitorQualificationWorkspaceController],
  providers: [MonitorQualificationWorkspaceService, MonitorQualificationMap],
  exports: [
    TypeOrmModule,
    MonitorQualificationWorkspaceService,
    MonitorQualificationMap,
  ],
})
export class MonitorQualificationWorkspaceModule {}
