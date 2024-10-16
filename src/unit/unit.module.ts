import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnitRepository])],
  controllers: [UnitController],
  providers: [UnitRepository, UnitService],
  exports: [TypeOrmModule, UnitRepository, UnitService],
})
export class UnitModule {}
