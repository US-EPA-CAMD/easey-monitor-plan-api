import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitMap } from '../maps/unit.map';
import { UnitWorkspaceController } from './unit.controller';
import { UnitWorkspaceRepository } from './unit.repository';
import { UnitWorkspaceService } from './unit.service';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [TypeOrmModule.forFeature([UnitWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
    ],
  controllers: [UnitWorkspaceController],
  providers: [UnitMap, UnitWorkspaceRepository, UnitWorkspaceService],
  exports: [
    TypeOrmModule,
    UnitMap,
    UnitWorkspaceRepository,
    UnitWorkspaceService,
  ],
})
export class UnitWorkspaceModule {}
