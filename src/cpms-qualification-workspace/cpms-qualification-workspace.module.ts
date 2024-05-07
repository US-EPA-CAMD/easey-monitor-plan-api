import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { CPMSQualificationWorkspaceController } from './cpms-qualification-workspace.controller';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import { CPMSQualificationWorkspaceService } from './cpms-qualification-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CPMSQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorQualificationWorkspaceModule),
  ],
  controllers: [CPMSQualificationWorkspaceController],
  providers: [
    CPMSQualificationWorkspaceRepository,
    CPMSQualificationWorkspaceService,
    CPMSQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    CPMSQualificationWorkspaceRepository,
    CPMSQualificationWorkspaceService,
    CPMSQualificationMap,
  ],
})
export class CPMSQualificationWorkspaceModule {}
