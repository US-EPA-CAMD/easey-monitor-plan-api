import { Routes } from "nest-router";

import { MonitorMethodModule } from "./monitoring-method/monitoring-method.module";
import { MonitorLocationModule } from "./monitor-location/monitor-location.module";
import {MonitorPlanModule} from "./monitor-plan/monitor-plan.module"


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
  {
    path: '/monitor-plans',
    module: MonitorPlanModule,    
  }, 

];

export default routes;