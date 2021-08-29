import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanCommentModule } from '../monitor-plan-comment/monitor-plan-comment.module';
import { UnitStackConfigurationModule } from '../unit-stack-configuration/unit-stack-configuration.module';
import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorMethodModule } from '../monitor-method/monitor-method.module';
import { MatsMethodModule } from '../mats-method/mats-method.module';
import { MonitorFormulaModule } from '../monitor-formula/monitor-formula.module';
import { MonitorSpanModule } from '../monitor-span/monitor-span.module';
import { MonitorLoadModule } from '../monitor-load/monitor-load.module';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { DuctWafModule } from '../duct-waf/duct-waf.module';
import { SystemFuelFlowModule } from '../system-fuel-flow/system-fuel-flow.module';
import { MonitorDefaultModule } from '../monitor-default/monitor-default.module';
import { MonitorAttributeModule } from '../monitor-attribute/monitor-attribute.module';
import { UnitCapacityModule } from '../unit-capacity/unit-capacity.module';
import { UnitControlModule } from '../unit-control/unit-control.module';
import { UnitFuelModule } from '../unit-fuel/unit-fuel.module';

import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanService } from './monitor-plan.service';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';

@Module({
  imports: [
    MonitorPlanCommentModule,
    UnitStackConfigurationModule,
    MonitorLocationModule,
    MonitorMethodModule,
    MatsMethodModule,
    MonitorFormulaModule,
    MonitorSpanModule,
    MonitorLoadModule,
    MonitorSystemModule,
    DuctWafModule,
    SystemFuelFlowModule,
    MonitorDefaultModule,
    MonitorAttributeModule,
    UnitCapacityModule,
    UnitControlModule,
    UnitFuelModule,
    TypeOrmModule.forFeature([MonitorPlanRepository]),
  ],
  controllers: [MonitorPlanController],
  providers: [MonitorPlanService, MonitorPlanMap],
})
export class MonitorPlanModule {}
