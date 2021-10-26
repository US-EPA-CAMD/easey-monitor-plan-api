import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AnalyzerRangeWorkspaceController } from './analyzer-range.controller';
import { AnalyzerRangeWorkspaceService } from './analyzer-range.service';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalyzerRangeWorkspaceRepository]),
    HttpModule,
  ],
  controllers: [AnalyzerRangeWorkspaceController],
  providers: [AnalyzerRangeWorkspaceService, AnalyzerRangeMap],
  exports: [TypeOrmModule, AnalyzerRangeWorkspaceService, AnalyzerRangeMap],
})
export class AnalyzerRangeWorkspaceModule {}
