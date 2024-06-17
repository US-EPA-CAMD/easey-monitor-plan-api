import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitProgramRepository } from './unit-program.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UnitProgramRepository])],
  providers: [UnitProgramRepository],
  exports: [TypeOrmModule, UnitProgramRepository],
})
export class UnitProgramModule {}
