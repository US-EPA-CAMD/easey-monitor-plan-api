import { Module } from '@nestjs/common';
import { UnitModule } from '../unit/unit.module';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { PlantModule } from '../plant/plant.module';
import { ImportChecksService } from './import-checks.service';
import { IsInDbValuesConstraint } from './pipes/is-in-db-values.pipe';
import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';

@Module({
  imports: [
    ComponentWorkspaceModule,
    MonitorLocationWorkspaceModule,
    PlantModule,
    UnitModule,
    UnitStackConfigurationWorkspaceModule,
  ],
  providers: [ImportChecksService, IsInDbValuesConstraint],
  exports: [ImportChecksService],
})
export class ImportChecksModule {}
