import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UnitControlWorkspaceController } from './unit-control.controller';
import { UnitControlWorkspaceService } from './unit-control.service';
import { UnitControlWorkspaceRepository } from './unit-control.repository';
import { UnitControlMap } from '../maps/unit-control.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitControlWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [UnitControlWorkspaceController],
  providers: [UnitControlWorkspaceService, UnitControlMap],
  exports: [TypeOrmModule, UnitControlWorkspaceService, UnitControlMap],
})
export class UnitControlWorkspaceModule {}
