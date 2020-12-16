import { Routes } from "nest-router";

import { MonitorPlanModule } from "./monitor-plan/monitor-plan.module"
import { MonitorLocationModule } from "./monitor-location/monitor-location.module";
import { MonitorMethodModule } from "./monitoring-method/monitoring-method.module";

const routes: Routes = [
  {
    path: '/monitoring-plans',
    module: MonitorPlanModule,
  },
  {
    path: '/monitoring-locations',
    module: MonitorLocationModule,
    children: [
      {
        path: ':id/methods',
        module: MonitorMethodModule,
      },
    ],
  },
];

export default routes;