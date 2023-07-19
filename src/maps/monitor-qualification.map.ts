import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { LEEQualificationMap } from './lee-qualification.map';
import { LMEQualificationMap } from './lme-qualification.map';
import { PCTQualificationMap } from './pct-qualification.map';

import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { MonitorQualificationDTO } from '../dtos/monitor-qualification.dto';
import { CPMSQualificationMap } from './cpms-qualification.map';

@Injectable()
export class MonitorQualificationMap extends BaseMap<
  MonitorQualification,
  MonitorQualificationDTO
> {
  constructor(
    private readonly leeMap: LEEQualificationMap,
    private readonly lmeMap: LMEQualificationMap,
    private readonly pctMap: PCTQualificationMap,
    private readonly cpmsMap: CPMSQualificationMap,
  ) {
    super();
  }

  public async one(
    entity: MonitorQualification,
  ): Promise<MonitorQualificationDTO> {
    const leeQualifications = entity.leeQualifications
      ? await this.leeMap.many(entity.leeQualifications)
      : [];
    const lmeQualifications = entity.lmeQualifications
      ? await this.lmeMap.many(entity.lmeQualifications)
      : [];
    const pctQualifications = entity.pctQualifications
      ? await this.pctMap.many(entity.pctQualifications)
      : [];
    const cpmsQualifications = entity.cpmsQualifications
      ? await this.cpmsMap.many(entity.cpmsQualifications)
      : [];

    return {
      id: entity.id,
      locationId: entity.locationId,
      qualificationTypeCode: entity.qualificationTypeCode,
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,
      active: entity.endDate === null,
      leeQualifications,
      lmeQualifications,
      pctQualifications,
      cpmsQualifications,
    };
  }
}
