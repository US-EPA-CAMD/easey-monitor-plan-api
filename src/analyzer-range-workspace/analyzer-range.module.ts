import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeWorkspacController } from './analyzer-range.controller';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyzerRangeWorkspaceRepository])],
  controllers: [AnalyzerRangeWorkspacController],
  providers: [AnalyzerRangeWorkspaceService, AnalyzerRangeMap],
})
export class AnalyzerRangeWorkspaceModule {}
