import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitProgramMap } from '../maps/unit-program.map';
import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { UnitProgramRepository } from '../unit-program/unit-program.repository';
import { UnitProgramController } from '../unit-program/unit-program.controller';
import { UnitProgramService } from '../unit-program/unit-program.service';

/**
 * There is currently no workspace version of UnitProgram. Therefore, use the
 * non-workspace version of controller/service/repository.
 * This module is needed because this data is accessed from ECMPS, Monitoring
 * Plan, Unit Information section. But the data is not edited or updated.
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitProgramRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanModule),
  ],
  controllers: [UnitProgramController],
  providers: [
    UnitProgramRepository,
    UnitProgramService,
    UnitProgramMap,
  ],
  exports: [
    TypeOrmModule,
    UnitProgramRepository,
    UnitProgramService,
    UnitProgramMap,
  ],
})
export class UnitProgramWorkspaceModule {}
