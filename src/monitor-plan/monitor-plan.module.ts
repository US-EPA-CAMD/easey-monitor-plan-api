import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanController } from './monitor-plan.controller';
import { MonitorPlanService } from './monitor-plan.service';

import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MonitorLocationMap } from '../maps/monitor-location.map';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { MonitorSystemMap } from '../maps/monitor-system.map';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { MatsMethodRepository } from '../mats-method/mats-method.repository';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorSpanRepository } from '../monitor-span/monitor-span.repository';
import { MonitorLoadRepository } from '../monitor-load/monitor-load.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanRepository,
      MonitorLocationRepository,
      MonitorMethodRepository,
      MatsMethodRepository,
      MonitorFormulaRepository,
      MonitorSpanRepository,
      MonitorLoadRepository,
      MonitorSystemRepository,
    ]),
  ],
  controllers: [MonitorPlanController],
  providers: [
    MonitorPlanService,
    MonitorPlanMap,
    MonitorLocationMap,
    MatsMethodMap,
    MonitorMethodMap,
    MonitorFormulaMap,
    MonitorSpanMap,
    MonitorLoadMap,
    MonitorSystemMap,
  ],
})
export class MonitorPlanModule {}
