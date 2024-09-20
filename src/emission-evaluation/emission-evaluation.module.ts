import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmissionEvaluationRepository } from './emission-evaluation.repository';
import { EmissionEvaluationService } from './emission-evaluation.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmissionEvaluationRepository])],
  providers: [EmissionEvaluationRepository, EmissionEvaluationService],
  exports: [
    TypeOrmModule,
    EmissionEvaluationRepository,
    EmissionEvaluationService,
  ],
})
export class EmissionEvaluationModule {}
