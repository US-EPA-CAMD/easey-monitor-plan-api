import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitCapacityController } from './unit-capacity.controller';
import { UnitCapacityService } from './unit-capacity.service';
import { UnitCapacityRepository } from './unit-capacity.repository';
import { UnitCapacityMap } from '../maps/unit-capacity.map';

@Module({
  imports: [TypeOrmModule.forFeature([UnitCapacityRepository])],
  controllers: [UnitCapacityController],
  providers: [UnitCapacityService, UnitCapacityMap],
  exports: [TypeOrmModule, UnitCapacityService, UnitCapacityMap],
})
export class UnitCapacityModule {}
