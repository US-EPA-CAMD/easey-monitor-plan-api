import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AnalyzerRangeWorkspaceController } from './analyzer-range.controller';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { AnalyzerRangeChecksService } from './analyzer-range-checks.service';

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
    AnalyzerRangeWorkspaceService,
    AnalyzerRangeMap,
    AnalyzerRangeChecksService,
  ],
  exports: [
    TypeOrmModule,
    AnalyzerRangeWorkspaceService,
    AnalyzerRangeMap,
    AnalyzerRangeChecksService,
  ],
})
export class AnalyzerRangeWorkspaceModule {}
