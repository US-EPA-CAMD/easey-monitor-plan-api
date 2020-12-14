import { Routes } from "nest-router";

import { MonitorMethodModule } from "./monitoring-method/monitoring-method.module";
import { MonitorLocationModule } from "./monitor-location/monitor-location.module";


const routes: Routes = [
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