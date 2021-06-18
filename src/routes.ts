import { Routes } from 'nest-router';

import { ComponentModule } from './component/component.module';
import { MonitorFormulaModule } from './monitor-formula/monitor-formula.module';
import { MonitorLoadModule } from './monitor-load/monitor-load.module';
import { MonitorLocationModule } from './monitor-location/monitor-location.module';
import { MonitorMethodModule } from './monitor-method/monitor-method.module';
import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { MonitorSpanModule } from './monitor-span/monitor-span.module';
import { MonitorSystemModule } from './monitor-system/monitor-system.module';
import { SupplementalMethodsModule } from './supplemental-methods/supplemental-methods.module';

const routes: Routes = [
  {
    path: '/monitor-plans',
    module: MonitorPlanModule,
  },
  {
    path: '/monitor-locations',
    module: MonitorLocationModule,
    children: [
      {
        path: ':id/methods',
        module: MonitorMethodModule,
      },
      {
        path: ':id/supplemental-methods',
        module: SupplementalMethodsModule,
      },
      {
        path: ':id/systems',
        module: MonitorSystemModule,
      },
      {
        path: ':id/components',
        module: ComponentModule,
      },
      {
        path: ':id/spans',
        module: MonitorSpanModule,
      },
      {
        path: ':id/loads',
        module: MonitorLoadModule,
      },
      {
        path: ':id/formulas',
        module: MonitorFormulaModule,
      },
    ],
  },
  {
    path: 'workspace',
    module: MonitorLocationModule,
    children: [
      {
        path: ':id/methods',
        module: MonitorMethodModule,
      },
      {
        path: ':id/supplemental-methods',
        module: SupplementalMethodsModule,
      },
      {
        path: ':id/systems',
        module: MonitorSystemModule,
      },
      {
        path: ':id/components',
        module: ComponentModule,
      },
      {
        path: ':id/spans',
        module: MonitorSpanModule,
      },
      {
        path: ':id/loads',
        module: MonitorLoadModule,
      },
      {
        path: ':id/formulas',
        module: MonitorFormulaModule,
      },
    ],
  },
];

export default routes;
