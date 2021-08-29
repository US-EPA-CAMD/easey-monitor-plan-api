import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LEEQualificationController } from './lee-qualification.controller';
import { LEEQualificationService } from './lee-qualification.service';
import { LEEQualificationRepository } from './lee-qualification.repository';
import { LEEQualificationMap } from '../maps/lee-qualification.map';

@Module({
  imports: [TypeOrmModule.forFeature([LEEQualificationRepository])],
  controllers: [LEEQualificationController],
  providers: [LEEQualificationService, LEEQualificationMap],
  exports: [TypeOrmModule, LEEQualificationService, LEEQualificationMap],
})
export class LEEQualificationModule {}
