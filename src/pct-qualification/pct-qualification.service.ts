import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PCTQualificationRepository } from './pct-qualification.repository';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationMap } from '../maps/pct-qualification.map';

@Injectable()
export class PCTQualificationService {
  constructor(
    @InjectRepository(PCTQualificationRepository)
    private repository: PCTQualificationRepository,
    private map: PCTQualificationMap,
  ) {}

  async getPCTQualifications(
    qualificationId: string,
  ): Promise<PCTQualificationDTO[]> {
    const results = await this.repository.find({ qualificationId });
    return this.map.many(results);
  }
}
