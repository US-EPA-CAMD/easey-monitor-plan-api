import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitControlMap } from '../maps/unit-control.map';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { UnitModule } from '../unit/unit.module';
import { UnitControlChecksService } from './unit-control-checks.service';
import { UnitControlWorkspaceController } from './unit-control.controller';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { UnitControlWorkspaceService } from './unit-control.service';

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
    UnitControlWorkspaceRepository,
    UnitControlWorkspaceService,
    UnitControlMap,
    UnitControlChecksService,
  ],
  exports: [
    TypeOrmModule,
    UnitControlWorkspaceRepository,
    UnitControlWorkspaceService,
    UnitControlMap,
    UnitControlChecksService,
  ],
})
export class UnitControlWorkspaceModule {}
