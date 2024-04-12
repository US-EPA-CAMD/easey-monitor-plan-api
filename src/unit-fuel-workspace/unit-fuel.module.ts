import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitFuelMap } from '../maps/unit-fuel.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { UnitFuelWorkspaceController } from './unit-fuel.controller';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';
import { UnitFuelWorkspaceService } from './unit-fuel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitFuelWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [UnitFuelWorkspaceController],
  providers: [
    UnitFuelWorkspaceRepository,
    UnitFuelWorkspaceService,
    UnitFuelMap,
  ],
  exports: [
    TypeOrmModule,
    UnitFuelWorkspaceRepository,
    UnitFuelWorkspaceService,
    UnitFuelMap,
  ],
})
export class UnitFuelWorkspaceModule {}
