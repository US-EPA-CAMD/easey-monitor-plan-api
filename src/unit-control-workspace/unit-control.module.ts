import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UnitControlWorkspaceController } from './unit-control.controller';
import { UnitControlWorkspaceService } from './unit-control.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { UnitControlMap } from '../maps/unit-control.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { UnitControlChecksService } from './unit-control-checks.service';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { UnitModule } from '../unit/unit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitControlWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorLocationWorkspaceModule),
    UnitModule,
  ],
  controllers: [UnitControlWorkspaceController],
  providers: [
    UnitControlWorkspaceService,
    UnitControlMap,
    UnitControlChecksService,
  ],
  exports: [
    TypeOrmModule,
    UnitControlWorkspaceService,
    UnitControlMap,
    UnitControlChecksService,
  ],
})
export class UnitControlWorkspaceModule {}
