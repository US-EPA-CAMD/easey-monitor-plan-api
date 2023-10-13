import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { PCTQualificationWorkspaceController } from './pct-qualification.controller';
import { PCTQualificationWorkspaceService } from './pct-qualification.service';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PCTQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorQualificationWorkspaceModule),
  ],
  controllers: [PCTQualificationWorkspaceController],
  providers: [PCTQualificationWorkspaceService, PCTQualificationMap],
  exports: [
    TypeOrmModule,
    PCTQualificationWorkspaceService,
    PCTQualificationMap,
  ],
})
export class PCTQualificationWorkspaceModule {}
