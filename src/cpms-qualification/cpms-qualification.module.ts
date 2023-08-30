import { Module } from '@nestjs/common';
import { CPMSQualificationService } from './cpms-qualification.service';
import { CPMSQualificationController } from './cpms-qualification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CPMSQualificationRepository } from './cpms-qualification.repository';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([CPMSQualificationRepository]),
    HttpModule,
  ],
  controllers: [CPMSQualificationController],
  providers: [CPMSQualificationService, CPMSQualificationMap],
  exports: [TypeOrmModule, CPMSQualificationService, CPMSQualificationMap],
})
export class CPMSQualificationModule {}
