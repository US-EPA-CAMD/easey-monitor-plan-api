import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmissionEvaluationModule } from '../emission-evaluation/emission-evaluation.module';
import { UnitStackConfigurationMap } from '../maps/unit-stack-configuration.map';
import { StackPipeWorkspaceModule } from '../stack-pipe-workspace/stack-pipe.module';
import { UnitModule } from '../unit/unit.module';
import { UnitStackConfigurationChecksService } from './unit-stack-configuration-checks.service';
import { UnitStackConfigurationWorkspaceController } from './unit-stack-configuration.controller';
import { UnitStackConfigurationWorkspaceRepository } from './unit-stack-configuration.repository';
import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitStackConfigurationWorkspaceRepository]),
    EmissionEvaluationModule,
    HttpModule,
    UnitModule,
    StackPipeWorkspaceModule,
  ],
  controllers: [UnitStackConfigurationWorkspaceController],
  providers: [
    UnitStackConfigurationChecksService,
    UnitStackConfigurationWorkspaceRepository,
    UnitStackConfigurationWorkspaceService,
    UnitStackConfigurationMap,
  ],
  exports: [
    TypeOrmModule,
    UnitStackConfigurationChecksService,
    UnitStackConfigurationWorkspaceRepository,
    UnitStackConfigurationWorkspaceService,
    UnitStackConfigurationMap,
  ],
})
export class UnitStackConfigurationWorkspaceModule {}
