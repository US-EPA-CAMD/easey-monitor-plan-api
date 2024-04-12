import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { MonitorConfigurationsWorkspaceController } from './monitor-configurations-workspace.controller';
import { MonitorConfigurationsWorkspaceService } from './monitor-configurations-workspace.service';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      MonitorPlanWorkspaceRepository,
      EvalStatusCodeRepository,
      SubmissionsAvailabilityStatusCodeRepository,
    ]),
    MonitorLocationWorkspaceModule,
    UnitStackConfigurationWorkspaceModule,
    MonitorPlanWorkspaceModule,
  ],
  controllers: [MonitorConfigurationsWorkspaceController],
  providers: [
    ConfigService,
    EvalStatusCodeRepository,
    MonitorConfigurationsWorkspaceService,
    MonitorPlanConfigurationMap,
    MonitorPlanWorkspaceRepository,
    SubmissionsAvailabilityStatusCodeRepository,
  ],
})
export class MonitorConfigurationsWorkspaceModule {}
