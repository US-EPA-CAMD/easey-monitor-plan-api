import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { LMEQualification } from '../entities/lme-qualification.entity';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';

@Injectable()
export class LMEQualificationMap extends BaseMap<
  LMEQualification,
  LMEQualificationDTO
> {
  public async one(entity: LMEQualification): Promise<LMEQualificationDTO> {
    return {
      id: entity.id,
      qualificationId: entity.qualificationId,
      qualificationDataYear: entity.qualificationDataYear,
      operatingHours: entity.operatingHours,
      so2Tons: entity.so2Tons,
      noxTons: entity.noxTons,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
