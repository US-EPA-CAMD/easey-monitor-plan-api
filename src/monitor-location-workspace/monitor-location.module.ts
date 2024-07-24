import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { DuctWafWorkspaceModule } from '../duct-waf-workspace/duct-waf.module';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MatsMethodWorkspaceModule } from '../mats-method-workspace/mats-method.module';
import { MonitorAttributeWorkspaceModule } from '../monitor-attribute-workspace/monitor-attribute.module';
import { MonitorDefaultWorkspaceModule } from '../monitor-default-workspace/monitor-default.module';
import { MonitorFormulaWorkspaceModule } from '../monitor-formula-workspace/monitor-formula.module';
import { MonitorLoadWorkspaceModule } from '../monitor-load-workspace/monitor-load.module';
import { MonitorMethodWorkspaceModule } from '../monitor-method-workspace/monitor-method.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { MonitorSpanWorkspaceModule } from '../monitor-span-workspace/monitor-span.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system.module';
import { StackPipeWorkspaceModule } from '../stack-pipe-workspace/stack-pipe.module';
import { UnitCapacityWorkspaceModule } from '../unit-capacity-workspace/unit-capacity.module';
import { UnitControlWorkspaceModule } from '../unit-control-workspace/unit-control.module';
import { UnitFuelWorkspaceModule } from '../unit-fuel-workspace/unit-fuel.module';
import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';
import { UnitModule } from '../unit/unit.module';
import { MonitorLocationChecksService } from './monitor-location-checks.service';
import { MonitorLocationWorkspaceController } from './monitor-location.controller';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocationWorkspaceService } from './monitor-location.service';

@Module({
  imports: [
    MonitorAttributeWorkspaceModule,
    UnitCapacityWorkspaceModule,
    UnitControlWorkspaceModule,
    UnitFuelWorkspaceModule,
    MonitorMethodWorkspaceModule,
    MatsMethodWorkspaceModule,
    MonitorFormulaWorkspaceModule,
    MonitorDefaultWorkspaceModule,
    MonitorSpanWorkspaceModule,
    DuctWafWorkspaceModule,
    MonitorLoadWorkspaceModule,
    ComponentWorkspaceModule,
    MonitorSystemWorkspaceModule,
    MonitorQualificationWorkspaceModule,
    UnitStackConfigurationWorkspaceModule,
    UnitModule,
    forwardRef(() => StackPipeWorkspaceModule),
    TypeOrmModule.forFeature([MonitorLocationWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [MonitorLocationWorkspaceController],
  providers: [
    MonitorLocationMap,
    MonitorLocationWorkspaceRepository,
    MonitorLocationWorkspaceService,
    MonitorLocationChecksService,
  ],
  exports: [
    TypeOrmModule,
    MonitorLocationWorkspaceRepository,
    MonitorLocationWorkspaceService,
    MonitorLocationMap,
    MonitorLocationChecksService,
  ],
})
export class MonitorLocationWorkspaceModule {}
