import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import { UpdatePCTQualificationDTO } from '../dtos/pct-qualification-update.dto';

import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class PCTQualificationWorkspaceService {
  constructor(
    @InjectRepository(PCTQualificationWorkspaceRepository)
    private repository: PCTQualificationWorkspaceRepository,
    private map: PCTQualificationMap,
    private Logger: Logger,
  ) {}

  async getPCTQualifications(
    locId: string,
    qualId: string,
  ): Promise<PCTQualificationDTO[]> {
    const results = await this.repository.getPCTQualifications(locId, qualId);
    return this.map.many(results);
  }

  async getPCTQualification(
    locId: string,
    qualId: string,
    pctQualId: string,
  ): Promise<PCTQualificationDTO> {
    const result = await this.repository.getPCTQualification(
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

  async createPCTQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: UpdatePCTQualificationDTO,
  ): Promise<PCTQualificationDTO> {
    const load = this.repository.create({
      id: uuid(),
      qualificationId: qualId,
      qualificationYear: payload.qualificationYear,
      averagePercentValue: payload.averagePercentValue,
      yr1QualificationDataYear: payload.yr1QualificationDataYear,
      yr1QualificationDataTypeCode: payload.yr1QualificationDataTypeCode,
      yr1PercentageValue: payload.yr1PercentageValue,
      yr2QualificationDataYear: payload.yr2QualificationDataYear,
      yr2QualificationDataTypeCode: payload.yr2QualificationDataTypeCode,
      yr2PercentageValue: payload.yr2PercentageValue,
      yr3QualificationDataYear: payload.yr3QualificationDataYear,
      yr3QualificationDataTypeCode: payload.yr3QualificationDataTypeCode,
      yr3PercentageValue: payload.yr3PercentageValue,
      userId: 'testuser',
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);

    return this.map.one(result);
  }

  async updatePCTQualification(
    userId: string,
    locId: string,
    qualId: string,
    pctQualId: string,
    payload: UpdatePCTQualificationDTO,
  ): Promise<PCTQualificationDTO> {
    const pctQual = await this.getPCTQualification(locId, qualId, pctQualId);

    pctQual.qualificationId = qualId;
    pctQual.qualificationYear = payload.qualificationYear;
    pctQual.averagePercentValue = payload.averagePercentValue;
    pctQual.yr1QualificationDataYear = payload.yr1QualificationDataYear;
    pctQual.yr1QualificationDataTypeCode = payload.yr1QualificationDataTypeCode;
    pctQual.yr1PercentageValue = payload.yr1PercentageValue;
    pctQual.yr2QualificationDataYear = payload.yr2QualificationDataYear;
    pctQual.yr2QualificationDataTypeCode = payload.yr2QualificationDataTypeCode;
    pctQual.yr2PercentageValue = payload.yr2PercentageValue;
    pctQual.yr3QualificationDataYear = payload.yr3QualificationDataYear;
    pctQual.yr3QualificationDataTypeCode = payload.yr3QualificationDataTypeCode;
    pctQual.yr3PercentageValue = payload.yr3PercentageValue;
    pctQual.userId = 'testuser';
    pctQual.updateDate = new Date(Date.now());

    await this.repository.save(pctQual);
    return this.getPCTQualification(locId, qualId, pctQualId);
  }
}
