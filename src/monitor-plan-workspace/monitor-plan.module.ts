import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyzerRangeWorkspaceModule } from '../analyzer-range-workspace/analyzer-range.module';
import { ComponentWorkspaceModule } from '../component-workspace/component.module';
import { CountyCodeModule } from '../county-code/county-code.module';
import { DuctWafWorkspaceModule } from '../duct-waf-workspace/duct-waf.module';
import { ImportChecksModule } from '../import-checks/import-checks.module';
import { LEEQualificationWorkspaceModule } from '../lee-qualification-workspace/lee-qualification.module';
import { LMEQualificationWorkspaceModule } from '../lme-qualification-workspace/lme-qualification.module';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MatsMethodWorkspaceModule } from '../mats-method-workspace/mats-method.module';
import { MonitorAttributeWorkspaceModule } from '../monitor-attribute-workspace/monitor-attribute.module';
import { MonitorConfigurationsWorkspaceModule } from '../monitor-configurations-workspace/monitor-configurations-workspace.module';
import { MonitorDefaultWorkspaceModule } from '../monitor-default-workspace/monitor-default.module';
import { MonitorFormulaWorkspaceModule } from '../monitor-formula-workspace/monitor-formula.module';
import { MonitorLoadWorkspaceModule } from '../monitor-load-workspace/monitor-load.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { MonitorMethodWorkspaceModule } from '../monitor-method-workspace/monitor-method.module';
import { MonitorPlanCommentWorkspaceModule } from '../monitor-plan-comment-workspace/monitor-plan-comment.module';
import { MonitorPlanLocationModule } from '../monitor-plan-location-workspace/monitor-plan-location.module';
import { MonitorPlanReportingFreqWorkspaceModule } from '../monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.module';
import { MonitorQualificationWorkspaceModule } from '../monitor-qualification-workspace/monitor-qualification.module';
import { MonitorSpanWorkspaceModule } from '../monitor-span-workspace/monitor-span.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system.module';
import { PCTQualificationWorkspaceModule } from '../pct-qualification-workspace/pct-qualification.module';
import { PlantModule } from '../plant/plant.module';
import { ReportingPeriodModule } from '../reporting-period/reporting-period.module';
import { SystemComponentWorkspaceModule } from '../system-component-workspace/system-component.module';
import { SystemFuelFlowWorkspaceModule } from '../system-fuel-flow-workspace/system-fuel-flow.module';
import { UnitCapacityWorkspaceModule } from '../unit-capacity-workspace/unit-capacity.module';
import { UnitControlWorkspaceModule } from '../unit-control-workspace/unit-control.module';
import { UnitFuelWorkspaceModule } from '../unit-fuel-workspace/unit-fuel.module';
import { UnitProgramWorkspaceModule } from '../unit-program-workspace/unit-program.module';
import { UnitStackConfigurationWorkspaceModule } from '../unit-stack-configuration-workspace/unit-stack-configuration.module';
import { UserCheckOutModule } from '../user-check-out/user-check-out.module';
import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { MonitorPlanWorkspaceController } from './monitor-plan.controller';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { UnitWorkspaceModule } from '../unit-workspace/unit.module';
import { EaseyContentModule } from '../monitor-plan-easey-content/easey-content.module';

@Module({
  imports: [
    EaseyContentModule,
    ImportChecksModule,
    MonitorPlanCommentWorkspaceModule,
    UnitStackConfigurationWorkspaceModule,
    MonitorLocationWorkspaceModule,
    MonitorMethodWorkspaceModule,
    MatsMethodWorkspaceModule,
    forwardRef(() => MonitorConfigurationsWorkspaceModule),
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
    UnitProgramWorkspaceModule,
    ComponentWorkspaceModule,
    MonitorQualificationWorkspaceModule,
    AnalyzerRangeWorkspaceModule,
    LEEQualificationWorkspaceModule,
    LMEQualificationWorkspaceModule,
    PCTQualificationWorkspaceModule,
    UnitWorkspaceModule,
    UserCheckOutModule,
    CountyCodeModule,
    MonitorPlanLocationModule,
    MonitorPlanReportingFreqWorkspaceModule,
    PlantModule,
    TypeOrmModule.forFeature([MonitorPlanWorkspaceRepository]),
    HttpModule,
    ReportingPeriodModule,
  ],
  controllers: [MonitorPlanWorkspaceController],
  providers: [
    MonitorPlanWorkspaceRepository,
    MonitorPlanWorkspaceService,
    MonitorPlanMap,
    MonitorPlanChecksService,
  ],
  exports: [
    TypeOrmModule,
    MonitorPlanWorkspaceRepository,
    MonitorPlanWorkspaceService,
    MonitorPlanMap,
  ],
})
export class MonitorPlanWorkspaceModule {}
