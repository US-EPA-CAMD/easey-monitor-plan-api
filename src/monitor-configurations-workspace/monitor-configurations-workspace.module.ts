import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorConfigurationsWorkspaceController } from './monitor-configurations-workspace.controller';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      MonitorPlanWorkspaceRepository,
      EvalStatusCodeRepository,
      SubmissionsAvailabilityStatusCodeRepository,
    ]),
    MonitorPlanWorkspaceModule,
  ],
  controllers: [MonitorConfigurationsWorkspaceController],
  providers: [
    MonitorConfigurationsWorkspaceService,
    ConfigService,
    MonitorPlanConfigurationMap,
  ],
})
export class MonitorConfigurationsWorkspaceModule {}
