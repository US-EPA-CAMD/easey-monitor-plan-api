import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { PCTQualificationWorkspaceController } from './pct-qualification.controller';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PCTQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorQualificationWorkspaceModule),
  ],
  controllers: [PCTQualificationWorkspaceController],
  providers: [
    PCTQualificationWorkspaceRepository,
    PCTQualificationWorkspaceService,
    PCTQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    PCTQualificationWorkspaceRepository,
    PCTQualificationWorkspaceService,
    PCTQualificationMap,
  ],
})
export class PCTQualificationWorkspaceModule {}
