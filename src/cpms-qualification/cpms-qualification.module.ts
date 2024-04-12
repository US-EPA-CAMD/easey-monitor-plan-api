import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { CPMSQualificationController } from './cpms-qualification.controller';
import { CPMSQualificationRepository } from './cpms-qualification.repository';
import { CPMSQualificationService } from './cpms-qualification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CPMSQualificationRepository]),
    HttpModule,
  ],
  controllers: [CPMSQualificationController],
  providers: [
    CPMSQualificationRepository,
    CPMSQualificationService,
    CPMSQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    CPMSQualificationRepository,
    CPMSQualificationService,
    CPMSQualificationMap,
  ],
})
export class CPMSQualificationModule {}
