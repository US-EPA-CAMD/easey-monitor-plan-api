import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitRepository])],
  providers: [UnitService],
  exports: [TypeOrmModule, UnitService],
})
export class UnitModule {}
