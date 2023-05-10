import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { MonitorPlanCommentWorkspaceModule } from '../monitor-plan-comment-workspace/monitor-plan-comment.module';
import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { MonitorMethodWorkspaceModule } from '../monitor-method-workspace/monitor-method.module';
import { MatsMethodWorkspaceModule } from '../mats-method-workspace/mats-method.module';
import { MonitorFormulaWorkspaceModule } from '../monitor-formula-workspace/monitor-formula.module';
import { MonitorSpanWorkspaceModule } from '../monitor-span-workspace/monitor-span.module';
import { MonitorLoadWorkspaceModule } from '../monitor-load-workspace/monitor-load.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system.module';
import { DuctWafWorkspaceModule } from '../duct-waf-workspace/duct-waf.module';
import { SystemFuelFlowWorkspaceModule } from '../system-fuel-flow-workspace/system-fuel-flow.module';
import { MonitorDefaultWorkspaceModule } from '../monitor-default-workspace/monitor-default.module';
import { MonitorAttributeWorkspaceModule } from '../monitor-attribute-workspace/monitor-attribute.module';
import { UnitCapacityWorkspaceModule } from '../unit-capacity-workspace/unit-capacity.module';
import { UnitControlWorkspaceModule } from '../unit-control-workspace/unit-control.module';
import { UnitFuelWorkspaceModule } from '../unit-fuel-workspace/unit-fuel.module';
import { UserCheckOutModule } from '../user-check-out/user-check-out.module';
import { CountyCodeModule } from '../county-code/county-code.module';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { SystemComponentWorkspaceModule } from '../system-component-workspace/system-component.module';
import { AnalyzerRangeWorkspaceModule } from '../analyzer-range-workspace/analyzer-range.module';
import { LEEQualificationWorkspaceModule } from '../lee-qualification-workspace/lee-qualification.module';
import { LMEQualificationWorkspaceModule } from '../lme-qualification-workspace/lme-qualification.module';
import { PCTQualificationWorkspaceModule } from '../pct-qualification-workspace/pct-qualification.module';
import { MonitorPlanLocationModule } from '../monitor-plan-location-workspace/monitor-plan-location.module';

import { MonitorPlanWorkspaceController } from './monitor-plan.controller';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { ImportChecksModule } from '../import-checks/import-checks.module';
import { PlantModule } from '../plant/plant.module';
import { MonitorPlanReportingFreqWorkspaceModule } from '../monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.module';
import { MonitorPlanChecksService } from './monitor-plan-checks.service';

@Module({
  imports: [
    ImportChecksModule,
    MonitorPlanCommentWorkspaceModule,
    UnitStackConfigurationWorkspaceModule,
    MonitorLocationWorkspaceModule,
    MonitorMethodWorkspaceModule,
    MatsMethodWorkspaceModule,
    MonitorFormulaWorkspaceModule,
    MonitorSpanWorkspaceModule,
    MonitorLoadWorkspaceModule,
    MonitorSystemWorkspaceModule,
    DuctWafWorkspaceModule,
    SystemFuelFlowWorkspaceModule,
    SystemComponentWorkspaceModule,
    MonitorDefaultWorkspaceModule,
    MonitorAttributeWorkspaceModule,
    UnitCapacityWorkspaceModule,
    UnitControlWorkspaceModule,
    UnitFuelWorkspaceModule,
    ComponentWorkspaceModule,
    MonitorQualificationWorkspaceModule,
    AnalyzerRangeWorkspaceModule,
    LEEQualificationWorkspaceModule,
    LMEQualificationWorkspaceModule,
    PCTQualificationWorkspaceModule,
    UserCheckOutModule,
    CountyCodeModule,
    MonitorPlanLocationModule,
    MonitorPlanReportingFreqWorkspaceModule,
    PlantModule,
    TypeOrmModule.forFeature([MonitorPlanWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [MonitorPlanWorkspaceController],
  providers: [
    MonitorPlanWorkspaceService,
    MonitorPlanMap,
    MonitorPlanChecksService,
  ],
  exports: [TypeOrmModule, MonitorPlanWorkspaceService, MonitorPlanMap],
})
export class MonitorPlanWorkspaceModule {}
