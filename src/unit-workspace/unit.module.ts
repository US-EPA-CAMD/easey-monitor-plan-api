import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitWorkspaceRepository } from './unit.repository';
import { UnitWorkspaceService } from './unit.service';
import { UnitMap } from '../maps/unit.map';

@Module({
  imports: [TypeOrmModule.forFeature([UnitWorkspaceRepository])],
  providers: [UnitMap, UnitWorkspaceRepository, UnitWorkspaceService],
  exports: [
    TypeOrmModule,
    UnitMap,
    UnitWorkspaceRepository,
    UnitWorkspaceService,
  ],
})
export class UnitWorkspaceModule {}
