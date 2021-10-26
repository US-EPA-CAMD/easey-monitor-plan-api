import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { PCTQualification } from '../entities/pct-qualification.entity';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';

@Injectable()
export class PCTQualificationMap extends BaseMap<
  PCTQualification,
  PCTQualificationDTO
> {
  public async one(entity: PCTQualification): Promise<PCTQualificationDTO> {
    return {
      id: entity.id,
      qualificationId: entity.qualificationId,
      qualificationYear: entity.qualificationYear,
      averagePercentValue: entity.averagePercentValue,
      yr1QualificationDataYear: entity.yr1QualificationDataYear,
      yr1QualificationDataTypeCode: entity.yr1QualificationDataTypeCode,
      yr1PercentageValue: entity.yr1PercentageValue,
      yr2QualificationDataYear: entity.yr2QualificationDataYear,
      yr2QualificationDataTypeCode: entity.yr2QualificationDataTypeCode,
      yr2PercentageValue: entity.yr2PercentageValue,
      yr3QualificationDataYear: entity.yr3QualificationDataYear,
      yr3QualificationDataTypeCode: entity.yr3QualificationDataTypeCode,
      yr3PercentageValue: entity.yr3PercentageValue,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
    };
  }
}
