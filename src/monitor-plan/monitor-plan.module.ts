import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyzerRangeModule } from '../analyzer-range/analyzer-range.module';
import { ComponentModule } from '../component/component.module';
import { CPMSQualificationModule } from '../cpms-qualification/cpms-qualification.module';
import { DuctWafModule } from '../duct-waf/duct-waf.module';
import { LEEQualificationModule } from '../lee-qualification/lee-qualification.module';
import { LMEQualificationModule } from '../lme-qualification/lme-qualification.module';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MatsMethodModule } from '../mats-method/mats-method.module';
import { MonitorAttributeModule } from '../monitor-attribute/monitor-attribute.module';
import { MonitorDefaultModule } from '../monitor-default/monitor-default.module';
import { MonitorFormulaModule } from '../monitor-formula/monitor-formula.module';
import { MonitorLoadModule } from '../monitor-load/monitor-load.module';
import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorMethodModule } from '../monitor-method/monitor-method.module';
import { MonitorPlanCommentModule } from '../monitor-plan-comment/monitor-plan-comment.module';
import { MonitorPlanReportingFreqModule } from '../monitor-plan-reporting-freq/monitor-plan-reporting-freq.module';
import { MonitorQualificationModule } from '../monitor-qualification/monitor-qualification.module';
import { MonitorSpanModule } from '../monitor-span/monitor-span.module';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { PCTQualificationModule } from '../pct-qualification/pct-qualification.module';
import { SystemComponentModule } from '../system-component/system-component.module';
import { SystemFuelFlowModule } from '../system-fuel-flow/system-fuel-flow.module';
import { UnitCapacityModule } from '../unit-capacity/unit-capacity.module';
import { UnitControlModule } from '../unit-control/unit-control.module';
import { UnitFuelModule } from '../unit-fuel/unit-fuel.module';
import { UnitStackConfigurationModule } from '../unit-stack-configuration/unit-stack-configuration.module';
import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorPlanService } from './monitor-plan.service';

@Module({
  imports: [
    MonitorPlanCommentModule,
    UnitStackConfigurationModule,
    MonitorLocationModule,
    ComponentModule,
    MonitorMethodModule,
    MatsMethodModule,
    MonitorFormulaModule,
    MonitorSpanModule,
    MonitorLoadModule,
    MonitorSystemModule,
    DuctWafModule,
    SystemComponentModule,
    SystemFuelFlowModule,
    MonitorDefaultModule,
    MonitorAttributeModule,
    MonitorQualificationModule,
    LEEQualificationModule,
    LMEQualificationModule,
    PCTQualificationModule,
    CPMSQualificationModule,
    UnitCapacityModule,
    UnitControlModule,
    UnitFuelModule,
    MonitorPlanReportingFreqModule,
    AnalyzerRangeModule,
    TypeOrmModule.forFeature([MonitorPlanRepository]),
  ],
  controllers: [MonitorPlanController],
  providers: [MonitorPlanRepository, MonitorPlanService, MonitorPlanMap],
  exports: [MonitorPlanRepository, MonitorPlanService, MonitorPlanMap],
})
export class MonitorPlanModule {}
