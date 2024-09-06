import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanModule } from '../monitor-plan/monitor-plan.module';
import { ReportingFreqRepository } from './reporting-freq.repository';
import { ReportingFreqController } from './reporting-freq.controller';
import { ReportingFreqService } from './reporting-freq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportingFreqRepository]),
    HttpModule,
    forwardRef(() => MonitorPlanModule),
  ],
  controllers: [ReportingFreqController],
  providers: [
    ReportingFreqRepository,
    ReportingFreqService,
  ],
  exports: [
    TypeOrmModule,
    ReportingFreqRepository,
    ReportingFreqService,
  ],
})
export class ReportingFreqModule {}
