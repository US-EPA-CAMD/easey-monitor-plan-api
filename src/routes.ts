import { Routes } from "nest-router";

import { MonitorPlanModule } from "./monitor-plan/monitor-plan.module"
import { MonitorLocationModule } from "./monitor-location/monitor-location.module";
import { MonitorMethodModule } from "./monitor-method/monitor-method.module";
import { SupplementalMethodsModule} from "./supplemental-methods/supplemental-methods.module"
import { MonitorSystemModule} from "./monitor-system/monitor-system.module"

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
    ],
  },
];

export default routes;