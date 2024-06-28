import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitMap } from '../maps/unit.map';
import { UnitWorkspaceController } from './unit.controller';
import { UnitWorkspaceRepository } from './unit.repository';
import { UnitWorkspaceService } from './unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitWorkspaceRepository]), HttpModule],
  controllers: [UnitWorkspaceController],
  providers: [UnitMap, UnitWorkspaceRepository, UnitWorkspaceService],
  exports: [
    TypeOrmModule,
    UnitMap,
    UnitWorkspaceRepository,
    UnitWorkspaceService,
  ],
})
export class UnitWorkspaceModule {}
