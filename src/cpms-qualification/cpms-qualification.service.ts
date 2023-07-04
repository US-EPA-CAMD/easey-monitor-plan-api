import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPMSQualificationRepository } from './cpms-qualification.repository';
import { CPMSQualification } from '../entities/cpms-qualification.entity';

@Injectable()
export class CPMSQualificationService {
  constructor(
    @InjectRepository(CPMSQualificationRepository)
    private readonly repository: CPMSQualificationRepository,
  ) {}
}
