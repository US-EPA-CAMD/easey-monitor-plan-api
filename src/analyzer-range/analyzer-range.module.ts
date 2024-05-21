import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';
import { AnalyzerRangeController } from './analyzer-range.controller';
import { AnalyzerRangeRepository } from './analyzer-range.repository';
import { AnalyzerRangeService } from './analyzer-range.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyzerRangeRepository])],
  controllers: [AnalyzerRangeController],
  providers: [AnalyzerRangeRepository, AnalyzerRangeService, AnalyzerRangeMap],
  exports: [TypeOrmModule, AnalyzerRangeRepository, AnalyzerRangeMap],
})
export class AnalyzerRangeModule {}
