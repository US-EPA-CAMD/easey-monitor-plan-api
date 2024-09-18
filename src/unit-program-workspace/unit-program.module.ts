import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitProgramMap } from '../maps/unit-program.map';
import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { UnitProgramWorkspaceRepository } from './unit-program.repository';
import { UnitProgramWorkspaceController } from './unit-program.controller';
import { UnitProgramWorkspaceService } from './unit-program.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitProgramWorkspaceRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanModule),
  ],
  controllers: [UnitProgramWorkspaceController],
  providers: [
    UnitProgramWorkspaceRepository,
    UnitProgramWorkspaceService,
    UnitProgramMap,
  ],
  exports: [
    TypeOrmModule,
    UnitProgramWorkspaceRepository,
    UnitProgramWorkspaceService,
    UnitProgramMap,
  ],
})
export class UnitProgramWorkspaceModule {}
