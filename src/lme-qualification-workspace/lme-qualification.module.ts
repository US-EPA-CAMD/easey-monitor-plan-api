import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { LMEQualificationWorkspaceController } from './lme-qualification.controller';
import { LMEQualificationWorkspaceService } from './lme-qualification.service';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LMEQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorQualificationWorkspaceModule),
  ],
  controllers: [LMEQualificationWorkspaceController],
  providers: [LMEQualificationWorkspaceService, LMEQualificationMap],
  exports: [
    TypeOrmModule,
    LMEQualificationWorkspaceService,
    LMEQualificationMap,
  ],
})
export class LMEQualificationWorkspaceModule {}
