import { Module } from '@nestjs/common';

import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { PlantModule } from '../plant/plant.module';
import { UnitStackConfigurationModule } from '../unit-stack-configuration/unit-stack-configuration.module';
import { MonitorConfigurationsController } from './monitor-configurations.controller';
import { MonitorConfigurationsService } from './monitor-configurations.service';
import { UnitCapacityModule } from 'src/unit-capacity/unit-capacity.module';
import { UnitControlModule } from 'src/unit-control/unit-control.module';
import { UnitFuelModule } from 'src/unit-fuel/unit-fuel.module';

@Module({
  imports: [
    MonitorPlanModule,
    MonitorLocationModule,
    PlantModule,
    UnitStackConfigurationModule,
    UnitCapacityModule,
    UnitControlModule,
    UnitFuelModule
  ],
  controllers: [MonitorConfigurationsController],
  providers: [MonitorConfigurationsService],
})
export class MonitorConfigurationsModule {}
