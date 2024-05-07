import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { MonitorPlanRepository } from '../monitor-plan/monitor-plan.repository';
import { UnitStackConfigurationModule } from '../unit-stack-configuration/unit-stack-configuration.module';
import { MonitorConfigurationsController } from './monitor-configurations.controller';
import { MonitorConfigurationsService } from './monitor-configurations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanRepository]),
    MonitorPlanModule,
    MonitorLocationModule,
    UnitStackConfigurationModule,
  ],
  controllers: [MonitorConfigurationsController],
  providers: [MonitorPlanRepository, MonitorConfigurationsService],
})
export class MonitorConfigurationsModule {}
