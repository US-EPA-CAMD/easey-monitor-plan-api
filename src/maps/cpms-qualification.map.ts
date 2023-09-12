import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { CPMSQualificationDTO } from '../dtos/cpms-qualification.dto';
import { CPMSQualification } from '../entities/cpms-qualification.entity';
import { CPMSQualification as WorkspaceCPMSQualification } from '../entities/workspace/cpms-qualification.entity';

@Injectable()
export class CPMSQualificationMap extends BaseMap<
  CPMSQualification | WorkspaceCPMSQualification,
  CPMSQualificationDTO
> {
  public async one(
    entity: CPMSQualification | WorkspaceCPMSQualification,
  ): Promise<CPMSQualificationDTO> {
    return {
      id: entity.id,
      qualificationId: entity.qualificationId,
      qualificationDataYear: entity.qualificationDataYear,
      stackTestNumber: entity.stackTestNumber,
      operatingLimit: entity.operatingLimit,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
    };
  }
}
