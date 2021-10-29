import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LEEQualificationWorkspaceRepository } from './lee-qualification.repository';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';
import { LEEQualificationMap } from '../maps/lee-qualification.map';
import { UpdateLEEQualificationDTO } from '../dtos/lee-qualification-update.dto';

import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class LEEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LEEQualificationWorkspaceRepository)
    private repository: LEEQualificationWorkspaceRepository,
    private map: LEEQualificationMap,
    private Logger: Logger,
  ) {}

  async getLEEQualifications(
    locId: string,
    qualId: string,
  ): Promise<LEEQualificationDTO[]> {
    const results = await this.repository.getLEEQualifications(locId, qualId);
    return this.map.many(results);
  }

  async getLEEQualification(
    locId: string,
    qualId: string,
    pctQualId: string,
  ): Promise<LEEQualificationDTO> {
    const result = await this.repository.getLEEQualification(
      locId,
      qualId,
      pctQualId,
    );
    if (!result) {
      this.Logger.error(NotFoundException, 'PCT Qualification Not Found', {
        locId: locId,
        qualId: qualId,
        pctQualId: pctQualId,
      });
    }
    return this.map.one(result);
  }

  async createLEEQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: UpdateLEEQualificationDTO,
  ): Promise<LEEQualificationDTO> {
    const load = this.repository.create({
      id: uuid(),
      qualificationId: qualId,
      qualificationTestDate: payload.qualificationTestDate,
      parameterCode: payload.parameterCode,
      qualificationTestTypeCode: payload.qualificationTestTypeCode,
      potentialAnnualMassEmissions: payload.potentialAnnualMassEmissions,
      applicableEmissionStandard: payload.applicableEmissionStandard,
      unitsOfStandard: payload.unitsOfStandard,
      percentageOfEmissionStandard: payload.percentageOfEmissionStandard,
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);

    return this.map.one(result);
  }

  async updateLEEQualification(
    userId: string,
    locId: string,
    qualId: string,
    pctQualId: string,
    payload: UpdateLEEQualificationDTO,
  ): Promise<LEEQualificationDTO> {
    const leeQual = await this.getLEEQualification(locId, qualId, pctQualId);

    leeQual.qualificationId = qualId;
    leeQual.qualificationTestDate = payload.qualificationTestDate;
    leeQual.parameterCode = payload.parameterCode;
    leeQual.qualificationTestTypeCode = payload.qualificationTestTypeCode;
    leeQual.potentialAnnualMassEmissions = payload.potentialAnnualMassEmissions;
    leeQual.applicableEmissionStandard = payload.applicableEmissionStandard;
    leeQual.unitsOfStandard = payload.unitsOfStandard;
    leeQual.percentageOfEmissionStandard = payload.percentageOfEmissionStandard;
    leeQual.userId = 'testuser';
    leeQual.updateDate = new Date(Date.now());

    await this.repository.save(leeQual);
    return this.getLEEQualification(locId, qualId, pctQualId);
  }
}
