import { Routes } from 'nest-router';

import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { MonitorPlanWorkspaceModule } from './monitor-plan-workspace/monitor-plan.module';

import { MonitorPlanCommentModule } from './monitor-plan-comment/monitor-plan-comment.module';
import { MonitorPlanCommentWorkspaceModule } from './monitor-plan-comment-workspace/monitor-plan-comment.module';

import { MonitorLocationModule } from './monitor-location/monitor-location.module';
import { MonitorLocationWorkspaceModule } from './monitor-location-workspace/monitor-location.module';

import { UnitControlModule } from './unit-control/unit-control.module';
import { UnitControlWorkspaceModule } from './unit-control-workspace/unit-control.module';

import { MonitorAttributeModule } from './monitor-attribute/monitor-attribute.module';
import { MonitorAttributeWorkspaceModule } from './monitor-attribute-workspace/monitor-attribute.module';

import { MonitorMethodModule } from './monitor-method/monitor-method.module';
import { MonitorMethodWorkspaceModule } from './monitor-method-workspace/monitor-method.module';

import { MatsMethodModule } from './mats-method/mats-method.module';
import { MatsMethodWorkspaceModule } from './mats-method-workspace/mats-method.module';

import { MonitorFormulaModule } from './monitor-formula/monitor-formula.module';
import { MonitorFormulaWorkspaceModule } from './monitor-formula-workspace/monitor-formula.module';

import { MonitorDefaultModule } from './monitor-default/monitor-default.module';
import { MonitorDefaultWorkspaceModule } from './monitor-default-workspace/monitor-default.module';

import { MonitorSpanModule } from './monitor-span/monitor-span.module';
import { MonitorSpanWorkspaceModule } from './monitor-span-workspace/monitor-span.module';

import { DuctWafModule } from './duct-waf/duct-waf.module';
import { DuctWafWorkspaceModule } from './duct-waf-workspace/duct-waf.module';

import { MonitorLoadModule } from './monitor-load/monitor-load.module';
import { MonitorLoadWorkspaceModule } from './monitor-load-workspace/monitor-load.module';

import { ComponentModule } from './component/component.module';
import { ComponentWorkspaceModule } from './component-workspace/component.module';

import { AnalyzerRangeModule } from './analyzer-range/analyzer-range.module';
import { AnalyzerRangeWorkspaceModule } from './analyzer-range-workspace/analyzer-range.module';

import { MonitorSystemModule } from './monitor-system/monitor-system.module';
import { MonitorSystemWorkspaceModule } from './monitor-system-workspace/monitor-system.module';

import { SystemFuelFlowModule } from './system-fuel-flow/system-fuel-flow.module';
import { SystemFuelFlowWorkspaceModule } from './system-fuel-flow-workspace/system-fuel-flow.module';

import { SystemComponentModule } from './system-component/system-component.module';
import { SystemComponentWorkspaceModule } from './system-component-workspace/system-component.module';

import { MonitorQualificationModule } from './monitor-qualification/monitor-qualification.module';
import { MonitorQualificationWorkspaceModule } from './monitor-qualification-workspace/monitor-qualification.module';

import { LEEQualificationModule } from './lee-qualification/lee-qualification.module';
import { LEEQualificationWorkspaceModule } from './lee-qualification-workspace/lee-qualification.module';

import { LMEQualificationModule } from './lme-qualification/lme-qualification.module';
import { LMEQualificationWorkspaceModule } from './lme-qualification-workspace/lme-qualification.module';

import { PCTQualificationModule } from './pct-qualification/pct-qualification.module';
import { PCTQualificationWorkspaceModule } from './pct-qualification-workspace/pct-qualification.module';

import { UnitFuelModule } from './unit-fuel/unit-fuel.module';
import { UnitFuelWorkspaceModule } from './unit-fuel-workspace/unit-fuel.module';
import { UnitCapacityWorkspaceModule } from './unit-capacity-workspace/unit-capacity.module';
import { UnitCapacityModule } from './unit-capacity/unit-capacity.module';

import { CheckOutModule } from './check-out/check-out.module';
import { MonitorConfigurationsModule } from './monitor-configurations/monitor-configurations.module';
import { MonitorConfigurationsWorkspaceModule } from './monitor-configurations-workspace/monitor-configurations-workspace.module';
import { WhatHasDataModule } from './what-has-data/what-has-data.module';
import { StackPipeWorkspaceModule } from './stack-pipe-workspace/stack-pipe.module';
import { UnitWorkspaceModule } from './unit-workspace/unit.module';
import { UnitProgramModule } from './unit-program/unit-program.module';
import { UnitProgramWorkspaceModule } from './unit-program-workspace/unit-program.module';
import { UnitModule } from './unit/unit.module';
import { MonitorPlanReportingFreqModule } from './monitor-plan-reporting-freq/monitor-plan-reporting-freq.module';
import { MonitorPlanReportingFreqWorkspaceModule } from './monitor-plan-reporting-freq-workspace/monitor-plan-reporting-freq.module';

const routes: Routes = [
  {
    path: '/what-has-data',
    module: WhatHasDataModule,
  },
  {
    path: '/plans',
    module: MonitorPlanModule,
    children: [
      {
        path: ':planId/comments',
        module: MonitorPlanCommentModule,
      },
    ],
  },
  {
    path: '/configurations',
    module: MonitorConfigurationsModule,
  },
  {
    path: '/workspace/configurations',
    module: MonitorConfigurationsWorkspaceModule,
  },
  {
    path: '/workspace/plans',
    module: MonitorPlanWorkspaceModule,
    children: [
      {
        path: ':planId/comments',
        module: MonitorPlanCommentWorkspaceModule,
      },
    ],
  },
  {
    path: '/locations',
    module: MonitorLocationModule,
    children: [
      {
        path: ':locId/attributes',
        module: MonitorAttributeModule,
      },
      {
        path: ':locId/methods',
        module: MonitorMethodModule,
      },
      {
        path: ':locId/mats-methods',
        module: MatsMethodModule,
      },
      {
        path: ':locId/formulas',
        module: MonitorFormulaModule,
      },
      {
        path: ':locId/defaults',
        module: MonitorDefaultModule,
      },
      {
        path: ':locId/spans',
        module: MonitorSpanModule,
      },
      {
        path: ':locId/duct-wafs',
        module: DuctWafModule,
      },
      {
        path: ':locId/loads',
        module: MonitorLoadModule,
      },
      {
        path: ':locId/components',
        module: ComponentModule,
        children: [
          {
            path: ':compId/analyzer-ranges',
            module: AnalyzerRangeModule,
          },
        ],
      },
      {
        path: ':locId/systems',
        module: MonitorSystemModule,
        children: [
          {
            path: ':sysId/components',
            module: SystemComponentModule,
          },
          {
            path: ':sysId/fuel-flows',
            module: SystemFuelFlowModule,
          },
        ],
      },
      {
        path: ':locId/qualifications',
        module: MonitorQualificationModule,
        children: [
          {
            path: ':qualId/lee-qualifications',
            module: LEEQualificationModule,
          },
          {
            path: ':qualId/lme-qualifications',
            module: LMEQualificationModule,
          },
          {
            path: ':qualId/pct-qualifications',
            module: PCTQualificationModule,
          },
        ],
      },
      {
        path: ':locId/units',
        module: UnitModule,
        children: [
          {
            path: ':unitId/unit-fuels',
            module: UnitFuelModule,
          },
          {
            path: ':unitId/unit-controls',
            module: UnitControlModule,
          },
          {
            path: ':unitId/unit-capacities',
            module: UnitCapacityModule,
          },
          {
            path: ':unitId/unit-programs',
            module: UnitProgramModule,
          },
          {
            path: ':unitId/reporting-frequencies',
            module: MonitorPlanReportingFreqModule,
          },
        ],
      },
    ],
  },
  {
    path: '/workspace/locations',
    module: MonitorLocationWorkspaceModule,
    children: [
      {
        path: ':locId/attributes',
        module: MonitorAttributeWorkspaceModule,
      },
      {
        path: ':locId/methods',
        module: MonitorMethodWorkspaceModule,
      },
      {
        path: ':locId/mats-methods',
        module: MatsMethodWorkspaceModule,
      },
      {
        path: ':locId/formulas',
        module: MonitorFormulaWorkspaceModule,
      },
      {
        path: ':locId/defaults',
        module: MonitorDefaultWorkspaceModule,
      },
      {
        path: ':locId/spans',
        module: MonitorSpanWorkspaceModule,
      },
      {
        path: ':locId/duct-wafs',
        module: DuctWafWorkspaceModule,
      },
      {
        path: ':locId/loads',
        module: MonitorLoadWorkspaceModule,
      },
      {
        path: ':locId/components',
        module: ComponentWorkspaceModule,
        children: [
          {
            path: ':compId/analyzer-ranges',
            module: AnalyzerRangeWorkspaceModule,
          },
        ],
      },
      {
        path: ':locId/systems',
        module: MonitorSystemWorkspaceModule,
        children: [
          {
            path: ':sysId/components',
            module: SystemComponentWorkspaceModule,
          },
          {
            path: ':sysId/fuel-flows',
            module: SystemFuelFlowWorkspaceModule,
          },
        ],
      },
      {
        path: ':locId/qualifications',
        module: MonitorQualificationWorkspaceModule,
        children: [
          {
            path: ':qualId/lee-qualifications',
            module: LEEQualificationWorkspaceModule,
          },
          {
            path: ':qualId/lme-qualifications',
            module: LMEQualificationWorkspaceModule,
          },
          {
            path: ':qualId/pct-qualifications',
            module: PCTQualificationWorkspaceModule,
          },
        ],
      },
      {
        path: ':locId/units',
        module: UnitWorkspaceModule,
        children: [
          {
            path: ':unitId/unit-fuels',
            module: UnitFuelWorkspaceModule,
          },
          {
            path: ':unitId/unit-controls',
            module: UnitControlWorkspaceModule,
          },
          {
            path: ':unitId/unit-capacities',
            module: UnitCapacityWorkspaceModule,
          },
          {
            path: ':unitId/unit-programs',
            module: UnitProgramWorkspaceModule,
          },
          {
            path: ':unitId/reporting-frequencies',
            module: MonitorPlanReportingFreqWorkspaceModule,
          },
        ],
      },
    ],
  },
  {
    path: 'workspace/check-outs/plans',
    module: CheckOutModule,
  },
  {
    path: 'workspace/stack-pipes',
    module: StackPipeWorkspaceModule,
  },
];

export default routes;
