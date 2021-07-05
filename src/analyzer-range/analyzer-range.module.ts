import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyzerRangeController } from './analyzer-range.controller';
import { AnalyzerRangeService } from './analyzer-range.service';
import { AnalyzerRangeRepository } from './analyzer-range.repository';
import { AnalyzerRangeMap } from '../maps/analyzer-range.map';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyzerRangeRepository])],
  controllers: [AnalyzerRangeController],
  providers: [AnalyzerRangeService, AnalyzerRangeMap],
})
export class AnalyzerRangeModule {}
