import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';
import {
  CPMSQualificationBaseDTO,
  CPMSQualificationDTO,
} from 'src/dtos/cpms-qualification.dto';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { v4 as uuid } from 'uuid';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';

@Injectable()
export class CPMSQualificationWorkspaceService {
  constructor(
    @InjectRepository(CPMSQualificationWorkspaceRepository)
    private readonly repository: CPMSQualificationWorkspaceRepository,
    private readonly map: CPMSQualificationMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getCPMSQualificationByStackTestNumber(
    locId: string,
    qualId: string,
    stackTestNumber: string,
  ): Promise<CPMSQualificationDTO> {
    const result = await this.repository.getCPMSQualificationByStackTestNumber(
      locId,
      qualId,
      stackTestNumber,
    );
    if (result) {
      return this.map.one(result);
    }
  }

  async getCPMSQualifications(
    locId: string,
    qualId: string,
  ): Promise<CPMSQualificationDTO[]> {
    const results = await this.repository.getCPMSQualifications(locId, qualId);
    return this.map.many(results);
  }

  async createCPMSQualification(
    locationId: string,
    qualId: string,
    payload: CPMSQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<CPMSQualificationDTO> {
    const cpmsQual = this.repository.create({
      id: uuid(),
      qualificationId: qualId,
      qualificationDataYear: payload.qualificationDataYear,
      stackTestNumber: payload.stackTestNumber,
      operatingLimit: payload.operatingLimit,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await this.repository.save(cpmsQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updateCPMSQualification(
    locationId: string,
    qualId: string,
    cpmsQualId: string,
    payload: CPMSQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<CPMSQualificationDTO> {
    const cpmsQual = await this.repository.getCPMSQualification(
      locationId,
      qualId,
      cpmsQualId,
    );

    cpmsQual.qualificationId = qualId;
    cpmsQual.qualificationDataYear = payload.qualificationDataYear;
    cpmsQual.stackTestNumber = payload.stackTestNumber;
    cpmsQual.operatingLimit = payload.operatingLimit;
    cpmsQual.userId = userId;
    cpmsQual.updateDate = currentDateTime();

    const result = await this.repository.save(cpmsQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async importCPMSQualifications(
    locationId: string,
    qualificationId: string,
    cpmsQualifications: CPMSQualificationBaseDTO[],
    userId: string,
  ): Promise<void> {
    const promises = cpmsQualifications.map(async cpmsQualification => {
      const cpmsQualRecord = await this.getCPMSQualificationByStackTestNumber(
        locationId,
        qualificationId,
        cpmsQualification.stackTestNumber,
      );

      if (cpmsQualRecord) {
        await this.updateCPMSQualification(
          locationId,
          qualificationId,
          cpmsQualRecord.id,
          cpmsQualification,
          userId,
          true,
        );
      } else {
        await this.createCPMSQualification(
          locationId,
          qualificationId,
          cpmsQualification,
          userId,
          true,
        );
      }

      return true;
    });

    await Promise.all(promises);
  }
}
