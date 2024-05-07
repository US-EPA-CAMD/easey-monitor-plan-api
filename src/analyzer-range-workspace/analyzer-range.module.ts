import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { AnalyzerRangeChecksService } from './analyzer-range-checks.service';
import { AnalyzerRangeWorkspaceController } from './analyzer-range.controller';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnalyzerRangeWorkspaceRepository,
      ComponentWorkspaceRepository,
    ]),
    HttpModule,
    forwardRef(() => MonitorPlanWorkspaceModule),
  ],
  controllers: [AnalyzerRangeWorkspaceController],
  providers: [
    AnalyzerRangeWorkspaceRepository,
    AnalyzerRangeWorkspaceService,
    AnalyzerRangeMap,
    AnalyzerRangeChecksService,
    ComponentWorkspaceRepository,
  ],
  exports: [
    TypeOrmModule,
    AnalyzerRangeWorkspaceService,
    AnalyzerRangeMap,
    AnalyzerRangeChecksService,
  ],
})
export class AnalyzerRangeWorkspaceModule {}
