import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportingPeriodRepository } from './reporting-period.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReportingPeriodRepository])],
  providers: [ReportingPeriodRepository],
  exports: [TypeOrmModule, ReportingPeriodRepository],
})
export class ReportingPeriodModule {}
