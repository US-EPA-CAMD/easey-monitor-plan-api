import { Routes } from 'nest-router';

import { ComponentModule } from './component/component.module';
import { AnalyzerRangeModule } from './analyzer-range/analyzer-range.module';
import { MonitorFormulaModule } from './monitor-formula/monitor-formula.module';
import { MonitorLoadModule } from './monitor-load/monitor-load.module';
import { MonitorLocationModule } from './monitor-location/monitor-location.module';
import { MonitorLocationWorkspaceModule } from './monitor-location-workspace/monitor-location.module';
import { MonitorMethodModule } from './monitor-method/monitor-method.module';
import { MonitorMethodWorkspaceModule } from './monitor-method-workspace/monitor-method.module';
import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { MonitorPlanWorkspaceModule } from './monitor-plan-workspace/monitor-plan.module';
import { MonitorSpanModule } from './monitor-span/monitor-span.module';
import { MonitorSystemModule } from './monitor-system/monitor-system.module';
import { SystemComponentModule } from './system-component/system-component.module';
import { SystemFuelFlowModule } from './system-fuel-flow/system-fuel-flow.module';
import { MatsMethodModule } from './mats-method/mats-method.module';

const routes: Routes = [
  {
    path: '/plans',
    module: MonitorPlanModule,
  },
  {
    path: '/workspace/plans',
    module: MonitorPlanWorkspaceModule,
  },
  {
    path: '/locations',
    module: MonitorLocationModule,
    children: [
      {
        path: ':locId/methods',
        module: MonitorMethodModule,
      },
      {
        path: ':locId/mats-methods',
        module: MatsMethodModule,
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
        path: ':locId/spans',
        module: MonitorSpanModule,
      },
      {
        path: ':locId/loads',
        module: MonitorLoadModule,
      },
      {
        path: ':locId/formulas',
        module: MonitorFormulaModule,
      },
    ],
  },
  {
    path: '/workspace/locations',
    module: MonitorLocationWorkspaceModule,
    children: [
      {
        path: ':locId/methods',
        module: MonitorMethodWorkspaceModule,
      },
    ],
  },
];

export default routes;
