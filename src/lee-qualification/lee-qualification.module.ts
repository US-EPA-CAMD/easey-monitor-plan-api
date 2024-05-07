import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { LEEQualificationController } from './lee-qualification.controller';
import { LEEQualificationRepository } from './lee-qualification.repository';
import { LEEQualificationService } from './lee-qualification.service';

@Module({
  imports: [TypeOrmModule.forFeature([LEEQualificationRepository])],
  controllers: [LEEQualificationController],
  providers: [
    LEEQualificationRepository,
    LEEQualificationService,
    LEEQualificationMap,
  ],
  exports: [
    TypeOrmModule,
    LEEQualificationRepository,
    LEEQualificationService,
    LEEQualificationMap,
  ],
})
export class LEEQualificationModule {}
