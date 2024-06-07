import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { LMEQualificationController } from './lme-qualification.controller';
import { LMEQualificationRepository } from './lme-qualification.repository';
import { LMEQualificationService } from './lme-qualification.service';

@Module({
  imports: [TypeOrmModule.forFeature([LMEQualificationRepository])],
  controllers: [LMEQualificationController],
  providers: [
    LMEQualificationRepository,
    LMEQualificationService,
    LMEQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    LMEQualificationRepository,
    LMEQualificationService,
    LMEQualificationMap,
  ],
})
export class LMEQualificationModule {}
