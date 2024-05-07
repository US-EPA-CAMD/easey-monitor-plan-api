import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitControlMap } from '../maps/unit-control.map';
import { UnitControlController } from './unit-control.controller';
import { UnitControlRepository } from './unit-control.repository';
import { UnitControlService } from './unit-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitControlRepository])],
  controllers: [UnitControlController],
  providers: [UnitControlRepository, UnitControlService, UnitControlMap],
  exports: [
    TypeOrmModule,
    UnitControlRepository,
    UnitControlService,
    UnitControlMap,
  ],
})
export class UnitControlModule {}
