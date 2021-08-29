import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitFuelWorkspaceController } from './unit-fuel.controller';
import { UnitFuelWorkspaceService } from './unit-fuel.service';
import { UnitFuelWorkspaceRepository } from './unit-fuel.repository';
import { UnitFuelMap } from '../maps/unit-fuel.map';

@Module({
  imports: [TypeOrmModule.forFeature([UnitFuelWorkspaceRepository])],
  controllers: [UnitFuelWorkspaceController],
  providers: [UnitFuelWorkspaceService, UnitFuelMap],
  exports: [TypeOrmModule, UnitFuelWorkspaceService, UnitFuelMap],
})
export class UnitFuelWorkspaceModule {}
