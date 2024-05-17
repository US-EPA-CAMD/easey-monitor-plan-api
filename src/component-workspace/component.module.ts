import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentMap } from '../maps/component.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { SystemComponentMasterDataRelationshipModule } from '../system-component-master-data-relationship/system-component-master-data-relationship.module';
import { UsedIdentifierModule } from '../used-identifier/used-identifier.module';
import { AnalyzerRangeWorkspaceModule } from './../analyzer-range-workspace/analyzer-range.module';
import { ComponentCheckService } from './component-checks.service';
import { ComponentWorkspaceController } from './component.controller';
import { ComponentWorkspaceRepository } from './component.repository';
import { ComponentWorkspaceService } from './component.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComponentWorkspaceRepository]),
    forwardRef(() => AnalyzerRangeWorkspaceModule),
    SystemComponentMasterDataRelationshipModule,
    UsedIdentifierModule,
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [ComponentWorkspaceController],
  providers: [
    ComponentWorkspaceRepository,
    ComponentWorkspaceService,
    ComponentMap,
    ComponentCheckService,
  ],
  exports: [
    TypeOrmModule,
    ComponentWorkspaceRepository,
    ComponentWorkspaceService,
    ComponentMap,
    ComponentCheckService,
  ],
})
export class ComponentWorkspaceModule {}
