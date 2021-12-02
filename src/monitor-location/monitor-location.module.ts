import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorAttributeModule } from '../monitor-attribute/monitor-attribute.module';
import { UnitCapacityModule } from '../unit-capacity/unit-capacity.module';
import { UnitControlModule } from '../unit-control/unit-control.module';
import { UnitFuelModule } from '../unit-fuel/unit-fuel.module';
import { MonitorMethodModule } from '../monitor-method/monitor-method.module';
import { MatsMethodModule } from '../mats-method/mats-method.module';
import { MonitorFormulaModule } from '../monitor-formula/monitor-formula.module';
import { MonitorDefaultModule } from '../monitor-default/monitor-default.module';
import { MonitorSpanModule } from '../monitor-span/monitor-span.module';
import { DuctWafModule } from '../duct-waf/duct-waf.module';
import { MonitorLoadModule } from '../monitor-load/monitor-load.module';
import { ComponentModule } from '../component/component.module';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { MonitorQualificationModule } from '../monitor-qualification/monitor-qualification.module';

import { MonitorLocationRepository } from './monitor-location.repository';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MonitorLocationController } from './monitor-location.controller';
import { MonitorLocationService } from './monitor-location.service';
import { UnitStackConfigurationModule } from '../unit-stack-configuration/unit-stack-configuration.module';

@Module({
  imports: [
    MonitorAttributeModule,
    UnitCapacityModule,
    UnitControlModule,
    UnitFuelModule,
    MonitorMethodModule,
    MatsMethodModule,
    MonitorFormulaModule,
    MonitorDefaultModule,
    MonitorSpanModule,
    DuctWafModule,
    MonitorLoadModule,
    ComponentModule,
    MonitorSystemModule,
    MonitorQualificationModule,
    UnitStackConfigurationModule,
    TypeOrmModule.forFeature([MonitorLocationRepository]),
  ],
  controllers: [MonitorLocationController],
  providers: [MonitorLocationMap, MonitorLocationService],
  exports: [TypeOrmModule, MonitorLocationMap],
})
export class MonitorLocationModule {}
