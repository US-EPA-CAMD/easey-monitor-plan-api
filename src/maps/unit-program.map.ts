import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UnitProgram } from '../entities/workspace/unit-program.entity';
import { UnitProgramDTO } from '../dtos/unit-program.dto';

@Injectable()
export class UnitProgramMap extends BaseMap<UnitProgram, UnitProgramDTO> {
  public async one(entity: UnitProgram): Promise<UnitProgramDTO> {
    return {
      id: entity.id.toString(),
      unitRecordId: entity.unitId,
      programId: entity.programId,
      programCode: entity.programCode,
      classCode: entity.classCode,
      unitMonitorCertBeginDate: entity.unitMonitorCertBeginDate,
      unitMonitorCertDeadline: entity.unitMonitorCertDeadline,
      emissionsRecordingBeginDate: entity.emissionsRecordingBeginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
    };
  }
}
