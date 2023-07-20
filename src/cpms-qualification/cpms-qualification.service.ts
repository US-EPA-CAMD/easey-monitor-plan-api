import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPMSQualificationRepository } from './cpms-qualification.repository';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';

@Injectable()
export class CPMSQualificationService {
  constructor(
    @InjectRepository(CPMSQualificationRepository)
    private readonly repository: CPMSQualificationRepository,
    private readonly map: CPMSQualificationMap,
  ) {}

  async getCPMSQualifications(
    locId: string,
    qualId: string,
  ): Promise<CPMSQualificationDTO[]> {
    const results = await this.repository.getCPMSQualifications(locId, qualId);
    return this.map.many(results);
  }
}
