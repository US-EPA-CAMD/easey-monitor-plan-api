import { Module } from '@nestjs/common';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { PlantModule } from '../plant/plant.module';
import { ImportChecksService } from './import-checks.service';
import { IsInDbValuesConstraint } from './pipes/is-in-db-values.pipe';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system.module';

@Module({
  imports: [
    MonitorSystemWorkspaceModule,
    MonitorQualificationWorkspaceModule,
    ComponentWorkspaceModule,
    MonitorLocationWorkspaceModule,
    PlantModule,
  ],
  providers: [ImportChecksService, IsInDbValuesConstraint],
  exports: [ImportChecksService],
})
export class ImportChecksModule {}
