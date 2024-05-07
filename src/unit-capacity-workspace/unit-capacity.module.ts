import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { UnitCapacityWorkspaceController } from './unit-capacity.controller';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitCapacityWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [UnitCapacityWorkspaceController],
  providers: [
    UnitCapacityWorkspaceRepository,
    UnitCapacityWorkspaceService,
    UnitCapacityMap,
  ],
  exports: [
    TypeOrmModule,
    UnitCapacityWorkspaceRepository,
    UnitCapacityWorkspaceService,
    UnitCapacityMap,
  ],
})
export class UnitCapacityWorkspaceModule {}
