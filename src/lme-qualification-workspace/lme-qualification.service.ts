import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import { UpdateLMEQualificationDTO } from '../dtos/lme-qualification-update.dto';

import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class LMEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LMEQualificationWorkspaceRepository)
    private repository: LMEQualificationWorkspaceRepository,
    private map: LMEQualificationMap,
    private Logger: Logger,
  ) { }

  async getLMEQualifications(
    locId: string,
    qualId: string,
  ): Promise<LMEQualificationDTO[]> {
    const results = await this.repository.getLMEQualifications(locId, qualId);
    return this.map.many(results);
  }

  async getLMEQualification(
    locId: string,
    qualId: string,
    lmeQualId: string,
  ): Promise<LMEQualificationDTO> {
    const result = await this.repository.getLMEQualification(
      locId,
      qualId,
      lmeQualId,
    );
    if (!result) {
      this.Logger.error(NotFoundException, 'LME Qualification Not Found', true,{
        locId: locId,
        qualId: qualId,
        lmeQualId: lmeQualId,
      });
    }
    return this.map.one(result);
  }

  async createLMEQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: UpdateLMEQualificationDTO,
  ): Promise<LMEQualificationDTO> {
    const lmeQual = this.repository.create({
      id: uuid(),
      qualificationId: qualId,
      qualificationDataYear: payload.qualificationDataYear,
      operatingHours: payload.operatingHours,
      so2Tons: payload.so2Tons,
      noxTons: payload.noxTons,
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(lmeQual);

    return this.map.one(result);
  }

  async updateLMEQualification(
    userId: string,
    locId: string,
    qualId: string,
    lmeQualId: string,
    payload: UpdateLMEQualificationDTO,
  ): Promise<LMEQualificationDTO> {
    const lmeQual = await this.getLMEQualification(locId, qualId, lmeQualId);

    lmeQual.qualificationId = qualId;
    lmeQual.qualificationDataYear = payload.qualificationDataYear;
    lmeQual.operatingHours = payload.operatingHours;
    lmeQual.so2Tons = payload.so2Tons;
    lmeQual.noxTons = payload.noxTons;
    lmeQual.userId = 'testuser';
    lmeQual.updateDate = new Date(Date.now());

    await this.repository.save(lmeQual);
    return this.getLMEQualification(locId, qualId, lmeQualId);
  }
}
