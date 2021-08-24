import { Module } from '@nestjs/common';
import { UnitCapacityService } from './unit-capacity.service';
import { UnitCapacityController } from './unit-capacity.controller';

@Module({
  controllers: [UnitCapacityController],
  providers: [UnitCapacityService]
})
export class UnitCapacityModule {}
