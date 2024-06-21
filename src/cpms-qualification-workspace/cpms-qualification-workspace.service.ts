import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  CPMSQualificationBaseDTO,
  CPMSQualificationDTO,
} from '../dtos/cpms-qualification.dto';
import { CPMSQualificationMap } from '../maps/cpms-qualification.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';
import { withTransaction } from '../utils';
import { CPMSQualificationWorkspaceRepository } from './cpms-qualification-workspace.repository';

@Injectable()
export class CPMSQualificationWorkspaceService {
  constructor(
    private readonly repository: CPMSQualificationWorkspaceRepository,
    private readonly map: CPMSQualificationMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
    @Inject(forwardRef(() => MonitorQualificationWorkspaceService))
    private readonly mpQualService: MonitorQualificationWorkspaceService,
  ) {}

  async getCPMSQualificationByStackTestNumber(
    locId: string,
    qualId: string,
    stackTestNumber: string,
    trx?: EntityManager,
  ): Promise<CPMSQualificationDTO> {
    const result = await withTransaction(
      this.repository,
      trx,
    ).getCPMSQualificationByStackTestNumber(locId, qualId, stackTestNumber);
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

  async createCPMSQualification({
    locationId,
    qualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    payload: CPMSQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<CPMSQualificationDTO> {
    const qual = await this.mpQualService.getQualification(
      locationId,
      qualId,
      trx,
    );

    if (qual.qualificationTypeCode !== 'CPMS') {
      throw new EaseyException(
        new Error(
          'A Monitor Qualification CPMS record should not be reported for qualification type codes other than CPMS.',
        ),
        HttpStatus.BAD_REQUEST,
        {
          locationId: locationId,
          qualId: qualId,
        },
      );
    }

    const repository = withTransaction(this.repository, trx);

    const cpmsQual = repository.create({
      id: uuid(),
      qualificationId: qualId,
      qualificationDataYear: payload.qualificationDataYear,
      stackTestNumber: payload.stackTestNumber,
      operatingLimit: payload.operatingLimit,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await repository.save(cpmsQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async updateCPMSQualification({
    locationId,
    qualId,
    cpmsQualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    cpmsQualId: string;
    payload: CPMSQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<CPMSQualificationDTO> {
    const repository = withTransaction(this.repository, trx);

    const cpmsQual = await repository.getCPMSQualification(
      locationId,
      qualId,
      cpmsQualId,
    );

    cpmsQual.qualificationDataYear = payload.qualificationDataYear;
    cpmsQual.stackTestNumber = payload.stackTestNumber;
    cpmsQual.operatingLimit = payload.operatingLimit;
    cpmsQual.userId = userId;
    cpmsQual.updateDate = currentDateTime();

    const result = await repository.save(cpmsQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }

  async importCPMSQualifications(
    locationId: string,
    qualificationId: string,
    cpmsQualifications: CPMSQualificationBaseDTO[],
    userId: string,
    trx?: EntityManager,
  ): Promise<void> {
    const promises = cpmsQualifications.map(async cpmsQualification => {
      const cpmsQualRecord = await this.getCPMSQualificationByStackTestNumber(
        locationId,
        qualificationId,
        cpmsQualification.stackTestNumber,
        trx,
      );

      if (cpmsQualRecord) {
        await this.updateCPMSQualification({
          locationId,
          qualId: qualificationId,
          cpmsQualId: cpmsQualRecord.id,
          payload: cpmsQualification,
          userId,
          isImport: true,
          trx,
        });
      } else {
        await this.createCPMSQualification({
          locationId,
          qualId: qualificationId,
          payload: cpmsQualification,
          userId,
          isImport: true,
          trx,
        });
      }

      return true;
    });

    await Promise.all(promises);
  }
}
