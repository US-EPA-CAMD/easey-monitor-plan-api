import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UnitFuelWorkspaceController } from './unit-fuel.controller';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';
import { UnitFuelMap } from '../maps/unit-fuel.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitFuelWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [UnitFuelWorkspaceController],
  providers: [UnitFuelWorkspaceService, UnitFuelMap],
  exports: [TypeOrmModule, UnitFuelWorkspaceService, UnitFuelMap],
})
export class UnitFuelWorkspaceModule {}
