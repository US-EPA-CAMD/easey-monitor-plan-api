import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitFuelMap } from '../maps/unit-fuel.map';
import { UnitFuelController } from './unit-fuel.controller';
import { UnitFuelRepository } from './unit-fuel.repository';
import { UnitFuelService } from './unit-fuel.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitFuelRepository])],
  controllers: [UnitFuelController],
  providers: [UnitFuelRepository, UnitFuelService, UnitFuelMap],
  exports: [TypeOrmModule, UnitFuelRepository, UnitFuelService, UnitFuelMap],
})
export class UnitFuelModule {}
