import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitCapacityMap } from '../maps/unit-capacity.map';
import { UnitCapacityController } from './unit-capacity.controller';
import { UnitCapacityRepository } from './unit-capacity.repository';
import { UnitCapacityService } from './unit-capacity.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitCapacityRepository])],
  controllers: [UnitCapacityController],
  providers: [UnitCapacityRepository, UnitCapacityService, UnitCapacityMap],
  exports: [
    TypeOrmModule,
    UnitCapacityRepository,
    UnitCapacityService,
    UnitCapacityMap,
  ],
})
export class UnitCapacityModule {}
