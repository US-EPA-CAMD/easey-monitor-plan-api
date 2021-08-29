import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PCTQualificationController } from './pct-qualification.controller';
import { PCTQualificationService } from './pct-qualification.service';
import { PCTQualificationRepository } from './pct-qualification.repository';
import { PCTQualificationMap } from '../maps/pct-qualification.map';

@Module({
  imports: [TypeOrmModule.forFeature([PCTQualificationRepository])],
  controllers: [PCTQualificationController],
  providers: [PCTQualificationService, PCTQualificationMap],
  exports: [TypeOrmModule, PCTQualificationService, PCTQualificationMap],
})
export class PCTQualificationModule {}
