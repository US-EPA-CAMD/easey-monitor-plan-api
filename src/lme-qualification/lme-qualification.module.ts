import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LMEQualificationController } from './lme-qualification.controller';
import { LMEQualificationService } from './lme-qualification.service';
import { LMEQualificationRepository } from './lme-qualification.repository';
import { LMEQualificationMap } from '../maps/lme-qualification.map';

@Module({
  imports: [TypeOrmModule.forFeature([LMEQualificationRepository])],
  controllers: [LMEQualificationController],
  providers: [LMEQualificationService, LMEQualificationMap],
  exports: [TypeOrmModule, LMEQualificationService, LMEQualificationMap],
})
export class LMEQualificationModule {}
