import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitFuelController } from './unit-fuel.controller';
import { UnitFuelService } from './unit-fuel.service';
import { UnitFuelRepository } from './unit-fuel.repository';
import { UnitFuelMap } from '../maps/unit-fuel.map';

@Module({
  imports: [TypeOrmModule.forFeature([UnitFuelRepository])],
  controllers: [UnitFuelController],
  providers: [UnitFuelService, UnitFuelMap],
  exports: [TypeOrmModule, UnitFuelService, UnitFuelMap],
})
export class UnitFuelModule {}
