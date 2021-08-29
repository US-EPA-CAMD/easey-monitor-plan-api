import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LEEQualificationModule } from '../lee-qualification/lee-qualification.module';
import { LMEQualificationModule } from '../lme-qualification/lme-qualification.module';
import { PCTQualificationModule } from '../pct-qualification/pct-qualification.module';

import { MonitorQualificationController } from './monitor-qualification.controller';
import { MonitorQualificationService } from './monitor-qualification.service';
import { MonitorQualificationRepository } from './monitor-qualification.repository';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';

@Module({
  imports: [
    LEEQualificationModule,
    LMEQualificationModule,
    PCTQualificationModule,
    TypeOrmModule.forFeature([MonitorQualificationRepository]),
  ],
  controllers: [MonitorQualificationController],
  providers: [MonitorQualificationService, MonitorQualificationMap],
  exports: [
    TypeOrmModule,
    MonitorQualificationService,
    MonitorQualificationMap,
  ],
})
export class MonitorQualificationModule {}
