import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorAttributeWorkspaceModule } from '../monitor-attribute-workspace/monitor-attribute.module';
import { UnitCapacityWorkspaceModule } from '../unit-capacity-workspace/unit-capacity.module';
import { UnitControlWorkspaceModule } from '../unit-control-workspace/unit-control.module';
import { UnitFuelWorkspaceModule } from '../unit-fuel-workspace/unit-fuel.module';
import { MonitorMethodWorkspaceModule } from '../monitor-method-workspace/monitor-method.module';
import { MatsMethodWorkspaceModule } from '../mats-method-workspace/mats-method.module';
import { MonitorFormulaWorkspaceModule } from '../monitor-formula-workspace/monitor-formula.module';
import { MonitorDefaultWorkspaceModule } from '../monitor-default-workspace/monitor-default.module';
import { MonitorSpanWorkspaceModule } from '../monitor-span-workspace/monitor-span.module';
import { DuctWafWorkspaceModule } from '../duct-waf-workspace/duct-waf.module';
import { MonitorLoadWorkspaceModule } from '../monitor-load-workspace/monitor-load.module';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';

import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationWorkspaceController } from './monitor-location.controller';
import { MonitorLocationWorkspaceService } from './monitor-location.service';
import { UnitModule } from '../unit/unit.module';
import { StackPipeModule } from '../stack-pipe/stack-pipe.module';

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
    StackPipeModule,
    TypeOrmModule.forFeature([MonitorLocationWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [MonitorLocationWorkspaceController],
  providers: [MonitorLocationMap, MonitorLocationWorkspaceService],
  exports: [TypeOrmModule, MonitorLocationWorkspaceService, MonitorLocationMap],
})
export class MonitorLocationWorkspaceModule {}
