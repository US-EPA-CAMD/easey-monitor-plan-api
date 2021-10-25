import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UnitCapacityWorkspaceController } from './unit-capacity.controller';
import { UnitCapacityWorkspaceService } from './unit-capacity.service';
import { UnitCapacityWorkspaceRepository } from './unit-capacity.repository';
import { UnitCapacityMap } from '../maps/unit-capacity.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitCapacityWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [UnitCapacityWorkspaceController],
  providers: [UnitCapacityWorkspaceService, UnitCapacityMap],
  exports: [TypeOrmModule, UnitCapacityWorkspaceService, UnitCapacityMap],
})
export class UnitCapacityWorkspaceModule {}
