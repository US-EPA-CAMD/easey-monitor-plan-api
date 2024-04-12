import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { PCTQualificationController } from './pct-qualification.controller';
import { PCTQualificationRepository } from './pct-qualification.repository';
import { PCTQualificationService } from './pct-qualification.service';

@Module({
  imports: [TypeOrmModule.forFeature([PCTQualificationRepository])],
  controllers: [PCTQualificationController],
  providers: [
    PCTQualificationRepository,
    PCTQualificationService,
    PCTQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    PCTQualificationRepository,
    PCTQualificationService,
    PCTQualificationMap,
  ],
})
export class PCTQualificationModule {}
