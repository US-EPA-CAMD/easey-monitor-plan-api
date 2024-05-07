import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { LMEQualificationWorkspaceController } from './lme-qualification.controller';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LMEQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorQualificationWorkspaceModule),
  ],
  controllers: [LMEQualificationWorkspaceController],
  providers: [
    LMEQualificationWorkspaceRepository,
    LMEQualificationWorkspaceService,
    LMEQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    LMEQualificationWorkspaceRepository,
    LMEQualificationWorkspaceService,
    LMEQualificationMap,
  ],
})
export class LMEQualificationWorkspaceModule {}
