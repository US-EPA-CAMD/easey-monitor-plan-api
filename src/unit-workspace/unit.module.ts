import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { UnitWorkspaceRepository } from './unit.repository';
import { UnitWorkspaceController } from './unit.controller';
import { UnitWorkspaceService } from './unit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [UnitWorkspaceController],
  providers: [
    UnitWorkspaceRepository,
    UnitWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    UnitWorkspaceRepository,
    UnitWorkspaceService,
  ],
})
export class UnitWorkspaceModule {}
