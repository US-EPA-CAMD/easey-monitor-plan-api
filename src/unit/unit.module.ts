import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitMap } from '../maps/unit.map';
import { UnitController } from './unit.controller';
import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitRepository])],
  controllers: [UnitController],
  providers: [UnitMap, UnitRepository, UnitService],
  exports: [TypeOrmModule, UnitMap, UnitRepository, UnitService],
})
export class UnitModule {}
