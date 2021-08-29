import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';

@Injectable()
export class LEEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LEEQualificationWorkspaceRepository)
    private repository: LEEQualificationWorkspaceRepository,
    private map: LEEQualificationMap,
  ) {}

  async getLEEQualifications(
    qualificationId: string,
  ): Promise<LEEQualificationDTO[]> {
    const results = await this.repository.find({ qualificationId });
    return this.map.many(results);
  }
}
