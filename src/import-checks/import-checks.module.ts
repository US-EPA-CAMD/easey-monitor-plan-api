import { Module } from '@nestjs/common';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { UnitModule } from '../unit/unit.module';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { PlantModule } from '../plant/plant.module';
import { ImportChecksService } from './import-checks.service';
import { IsInDbValuesConstraint } from './pipes/is-in-db-values.pipe';
import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';
import { MonitorFormulaWorkspaceModule } from '../monitor-formula-workspace/monitor-formula.module';
import { MonitorSpanWorkspaceModule } from '../monitor-span-workspace/monitor-span.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system.module';

@Module({
  imports: [
    MonitorSpanWorkspaceModule,
    MonitorSystemWorkspaceModule,
    MonitorQualificationWorkspaceModule,
    MonitorFormulaWorkspaceModule,
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
