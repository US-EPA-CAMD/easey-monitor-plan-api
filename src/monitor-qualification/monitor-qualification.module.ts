import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LEEQualificationModule } from '../lee-qualification/lee-qualification.module';
import { LMEQualificationModule } from '../lme-qualification/lme-qualification.module';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { PCTQualificationModule } from '../pct-qualification/pct-qualification.module';
import { MonitorQualificationController } from './monitor-qualification.controller';
import { MonitorQualificationRepository } from './monitor-qualification.repository';
import { MonitorQualificationService } from './monitor-qualification.service';

@Module({
  imports: [
    LEEQualificationModule,
    LMEQualificationModule,
    PCTQualificationModule,
    TypeOrmModule.forFeature([MonitorQualificationRepository]),
  ],
  controllers: [MonitorQualificationController],
  providers: [
    MonitorQualificationRepository,
    MonitorQualificationService,
    MonitorQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    MonitorQualificationRepository,
    MonitorQualificationService,
    MonitorQualificationMap,
  ],
})
export class MonitorQualificationModule {}
