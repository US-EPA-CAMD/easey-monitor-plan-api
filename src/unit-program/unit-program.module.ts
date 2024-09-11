import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitProgramRepository } from './unit-program.repository';
import { UnitProgramController } from './unit-program.controller';
import { UnitProgramService } from './unit-program.service';
import { UnitProgramMap } from '../maps/unit-program.map';
import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';

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
export class UnitProgramModule {}
