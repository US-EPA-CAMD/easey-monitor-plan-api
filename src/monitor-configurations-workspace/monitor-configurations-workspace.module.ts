import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
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
import { PlantWorkspaceModule } from '../plant-workspace/plant.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      EvalStatusCodeRepository,
      SubmissionsAvailabilityStatusCodeRepository,
    ]),
    MonitorLocationWorkspaceModule,
    UnitStackConfigurationWorkspaceModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    PlantWorkspaceModule,
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
  exports: [
    EvalStatusCodeRepository,
    SubmissionsAvailabilityStatusCodeRepository,
  ],
})
export class MonitorConfigurationsWorkspaceModule {}
