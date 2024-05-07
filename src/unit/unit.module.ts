import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitRepository])],
  providers: [UnitRepository, UnitService],
  exports: [TypeOrmModule, UnitRepository, UnitService],
})
export class UnitModule {}
