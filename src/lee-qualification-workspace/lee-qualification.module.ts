import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { LEEQualificationWorkspaceController } from './lee-qualification.controller';
import { LEEQualificationWorkspaceService } from './lee-qualification.service';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LEEQualificationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorQualificationWorkspaceModule),
  ],
  controllers: [LEEQualificationWorkspaceController],
  providers: [
    LEEQualificationWorkspaceRepository,
    LEEQualificationWorkspaceService,
    LEEQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    LEEQualificationWorkspaceRepository,
    LEEQualificationWorkspaceService,
    LEEQualificationMap,
  ],
})
export class LEEQualificationWorkspaceModule {}
