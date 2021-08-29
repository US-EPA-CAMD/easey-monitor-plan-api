import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitControlController } from './unit-control.controller';
import { UnitControlService } from './unit-control.service';
import { UnitControlRepository } from './unit-control.repository';
import { UnitControlMap } from '../maps/unit-control.map';

@Module({
  imports: [TypeOrmModule.forFeature([UnitControlRepository])],
  controllers: [UnitControlController],
  providers: [UnitControlService, UnitControlMap],
  exports: [TypeOrmModule, UnitControlService, UnitControlMap],
})
export class UnitControlModule {}
