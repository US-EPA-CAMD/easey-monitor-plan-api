import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LEEQualificationWorkspaceModule } from '../lee-qualification-workspace/lee-qualification.module';
import { LMEQualificationWorkspaceModule } from '../lme-qualification-workspace/lme-qualification.module';
import { PCTQualificationWorkspaceModule } from '../pct-qualification-workspace/pct-qualification.module';

import { MonitorQualificationWorkspaceController } from './monitor-qualification.controller';
import { MonitorQualificationWorkspaceService } from './monitor-qualification.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';

@Module({
  imports: [
    LEEQualificationWorkspaceModule,
    LMEQualificationWorkspaceModule,
    PCTQualificationWorkspaceModule,
    TypeOrmModule.forFeature([MonitorQualificationWorkspaceRepository]),
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
