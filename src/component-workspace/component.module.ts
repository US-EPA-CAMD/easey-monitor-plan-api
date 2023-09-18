import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AnalyzerRangeWorkspaceModule } from './../analyzer-range-workspace/analyzer-range.module';

import { ComponentWorkspaceController } from './component.controller';
import { ComponentWorkspaceService } from './component.service';
import { ComponentWorkspaceRepository } from './component.repository';
import { ComponentMap } from '../maps/component.map';
import { ComponentCheckService } from './component-checks.service';
import { SystemComponentMasterDataRelationshipModule } from '../system-component-master-data-relationship/system-component-master-data-relationship.module';
import { UsedIdentifierModule } from '../used-identifier/used-identifier.module';
import { UsedIdentifierRepository } from '../used-identifier/used-identifier.repository';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [
    AnalyzerRangeWorkspaceModule,
    SystemComponentMasterDataRelationshipModule,
    UsedIdentifierModule,
    TypeOrmModule.forFeature([
      ComponentWorkspaceRepository,
      UsedIdentifierRepository,
    ]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [ComponentWorkspaceController],
  providers: [ComponentWorkspaceService, ComponentMap, ComponentCheckService],
  exports: [
    TypeOrmModule,
    ComponentWorkspaceService,
    ComponentMap,
    ComponentCheckService,
  ],
})
export class ComponentWorkspaceModule {}
