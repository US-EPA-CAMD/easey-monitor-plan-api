import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { StackPipeModule } from '../stack-pipe/stack-pipe.module';
import { UnitModule } from '../unit/unit.module';
import { UnitStackConfigurationWorkspaceController } from './unit-stack-configuration.controller';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitStackConfigurationWorkspaceRepository]),
    HttpModule,
    UnitModule,
    StackPipeModule,
  ],
  controllers: [UnitStackConfigurationWorkspaceController],
  providers: [
    UnitStackConfigurationWorkspaceRepository,
    UnitStackConfigurationWorkspaceService,
    UnitStackConfigurationMap,
  ],
  exports: [
    TypeOrmModule,
    UnitStackConfigurationWorkspaceRepository,
    UnitStackConfigurationWorkspaceService,
    UnitStackConfigurationMap,
  ],
})
export class UnitStackConfigurationWorkspaceModule {}
