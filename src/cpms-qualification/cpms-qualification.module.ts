import { Module } from '@nestjs/common';
import { CPMSQualificationService } from './cpms-qualification.service';
import { CPMSQualificationController } from './cpms-qualification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CPMSQualificationRepository } from './cpms-qualification.repository';
import { CPMSQualificationMap } from 'src/maps/cpms-qualification.map';

@Module({
  imports: [TypeOrmModule.forFeature([CPMSQualificationRepository])],
  controllers: [CPMSQualificationController],
  providers: [CPMSQualificationService, CPMSQualificationMap],
  exports: [TypeOrmModule, CPMSQualificationService, CPMSQualificationMap],
})
export class CPMSQualificationModule {}
