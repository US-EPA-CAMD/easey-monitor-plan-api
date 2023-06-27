import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { LEEQualification } from '../entities/lee-qualification.entity';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';

@Injectable()
export class LEEQualificationMap extends BaseMap<
  LEEQualification,
  LEEQualificationDTO
> {
  public async one(entity: LEEQualification): Promise<LEEQualificationDTO> {
    return {
      id: entity.id,
      qualificationId: entity.qualificationId,
      qualificationTestDate: entity.qualificationTestDate,
      parameterCode: entity.parameterCode,
      qualificationTestType: entity.qualificationTestType,
      potentialAnnualMassEmissions: entity.potentialAnnualMassEmissions,
      applicableEmissionStandard: entity.applicableEmissionStandard,
      unitsOfStandard: entity.unitsOfStandard,
      percentageOfEmissionStandard: entity.percentageOfEmissionStandard,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
    };
  }
}
