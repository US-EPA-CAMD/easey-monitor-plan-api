import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LEEQualificationRepository } from './lee-qualification.repository';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';

@Injectable()
export class LEEQualificationService {
  constructor(
    @InjectRepository(LEEQualificationRepository)
    private readonly repository: LEEQualificationRepository,
    private readonly map: LEEQualificationMap,
  ) {}

  async getLEEQualifications(
    qualificationId: string,
  ): Promise<LEEQualificationDTO[]> {
    const results = await this.repository.find({ qualificationId });
    return this.map.many(results);
  }
}
