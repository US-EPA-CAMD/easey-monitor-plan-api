import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UnitControlWorkspaceController } from './unit-control.controller';
import { UnitControlWorkspaceService } from './unit-control.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { UnitControlMap } from '../maps/unit-control.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { UnitControlChecksService } from './unit-control-checks.service';
import { MonitorLocationWorkspaceModule } from 'src/monitor-location-workspace/monitor-location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitControlWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    forwardRef(() => MonitorLocationWorkspaceModule),
  ],
  controllers: [UnitControlWorkspaceController],
  providers: [UnitControlWorkspaceService, UnitControlMap, UnitControlChecksService],
  exports: [TypeOrmModule, UnitControlWorkspaceService, UnitControlMap, UnitControlChecksService],
})
export class UnitControlWorkspaceModule {}
