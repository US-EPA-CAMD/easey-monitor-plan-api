import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanWorkspaceController } from './monitor-plan.controller';

import { MonitorPlanWorkspaceService } from './monitor-plan.service';
import { UserCheckOutService } from '../user-check-out/user-check-out.service';

import { UserCheckOutRepository } from '../user-check-out/user-check-out.repository';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MatsMethodWorkspaceRepository } from '../mats-method-workspace/mats-method.repository';
import { MonitorMethodWorkspaceRepository } from '../monitor-method-workspace/monitor-method.repository';

import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { UserCheckOutMap } from '../maps/user-check-out.map';
import { DuctWafWorkspaceRepository } from '../duct-waf-workspace/duct-waf.repository';
import { DuctWafMap } from 'src/maps/workspace/duct-waf.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanWorkspaceRepository,
      MonitorLocationWorkspaceRepository,
      MatsMethodWorkspaceRepository,
      MonitorMethodWorkspaceRepository,
      UserCheckOutRepository,
      DuctWafWorkspaceRepository,
    ]),
  ],
  controllers: [MonitorPlanWorkspaceController],
  providers: [
    MonitorPlanWorkspaceService,
    UserCheckOutService,
    MatsMethodMap,
    MonitorMethodMap,
    MonitorFormulaMap,
    MonitorSpanMap,
    MonitorLoadMap,
    MonitorLocationMap,
    MonitorPlanMap,
    MonitorSystemMap,
    UserCheckOutMap,
    DuctWafMap,
  ],
})
export class MonitorPlanWorkspaceModule {}
