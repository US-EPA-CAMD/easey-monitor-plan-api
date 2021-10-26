import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UnitStackConfigurationWorkspaceController } from './unit-stack-configuration.controller';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitStackConfigurationWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [UnitStackConfigurationWorkspaceController],
  providers: [
    UnitStackConfigurationWorkspaceService,
    UnitStackConfigurationMap,
  ],
  exports: [
    TypeOrmModule,
    UnitStackConfigurationWorkspaceService,
    UnitStackConfigurationMap,
  ],
})
export class UnitStackConfigurationWorkspaceModule {}
