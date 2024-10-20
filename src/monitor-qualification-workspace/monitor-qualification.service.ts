import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  MonitorQualificationBaseDTO,
  MonitorQualificationDTO,
  UpdateMonitorQualificationDTO,
} from '../dtos/monitor-qualification.dto';
import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { LEEQualificationWorkspaceService } from '../lee-qualification-workspace/lee-qualification.service';
import { LMEQualificationWorkspaceService } from '../lme-qualification-workspace/lme-qualification.service';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { PCTQualificationWorkspaceService } from '../pct-qualification-workspace/pct-qualification.service';
import { withTransaction } from '../utils';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';

@Injectable()
export class MonitorQualificationWorkspaceService {
  constructor(
    private readonly repository: MonitorQualificationWorkspaceRepository,
    private readonly map: MonitorQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,

    private readonly leeQualificationService: LEEQualificationWorkspaceService,
    private readonly lmeQualificationService: LMEQualificationWorkspaceService,
    private readonly pctQualificationService: PCTQualificationWorkspaceService,
  ) {
    this.logger.setContext('MonitorQualificationWorkspaceService');
  }

  runQualificationImportCheck(qualifications: UpdateMonitorQualificationDTO[]) {
    const errorList: string[] = [];

    for (const qual of qualifications) {
      if (qual.endDate) continue; // Don't perform checks on Inactive MonitorQualification Record

      if (qual.qualificationTypeCode !== 'LMEA') {
        qual.monitoringQualificationLMEData.forEach((lmeQual, idx) => {
          if (lmeQual.so2Tons !== null) {
            errorList.push(
              `[IMPORT11-NONCRIT-A] A value has been reported for SO2Tons for the Monitor Qualification LME record #${idx}. This field should be blank`,
            );
          }
        });
      }

      if (
        !['PK', 'SK', 'GF'].includes(qual.qualificationTypeCode) &&
        qual.monitoringQualificationPercentData.length > 0
      ) {
        errorList.push(
          `[IMPORT12-FATAL-A] You have reported a MonitorQualPercent record for a location with the Qualification Type Code not equal to PK, SK or GF. A MonitorQualPercent record should not be reported for qualification type codes other than PK, SK or GF.`,
        );
      }

      if (
        !['LMEA', 'LMES'].includes(qual.qualificationTypeCode) &&
        qual.monitoringQualificationLMEData.length > 0
      ) {
        errorList.push(
          `[IMPORT12-FATAL-B] You have reported a MonitorQualLME record for a location with the Qualification Type Code not equal to LMEA or LMES. A MonitorQualLME record should not be reported for qualification type codes other than LMEA or LMES.`,
        );
      }

      if (
        qual.qualificationTypeCode !== 'LEE' &&
        qual.monitoringQualificationLEEData.length > 0
      ) {
        errorList.push(
          `[IMPORT12-FATAL-D] You have reported a MonitorQualCPMS record for a location with the Qualification Type Code not equal to LEE. A MonitorQualCPMS record should not be reported for qualification type codes other than LEE.`,
        );
      }
    }

    console.log('errorList', errorList);

    return errorList;
  }

  private async importQualPctLeeLmeCpms(
    locationId: string,
    qualificationRecordId: string,
    qualification: UpdateMonitorQualificationDTO,
    userId: string,
    trx?: EntityManager,
  ): Promise<void> {
    const promises = [];
    if (
      qualification.monitoringQualificationLEEData?.length > 0 &&
      qualification.qualificationTypeCode === 'LEE'
    ) {
      promises.push(
        this.leeQualificationService.importLEEQualification(
          locationId,
          qualificationRecordId,
          qualification.monitoringQualificationLEEData,
          userId,
          trx,
        ),
      );
    }

    if (
      qualification.monitoringQualificationLMEData?.length > 0 &&
      ['LMEA', 'LMES'].includes(qualification.qualificationTypeCode)
    ) {
      promises.push(
        this.lmeQualificationService.importLMEQualification(
          locationId,
          qualificationRecordId,
          qualification.monitoringQualificationLMEData,
          userId,
          trx,
        ),
      );
    }

    if (
      qualification.monitoringQualificationPercentData?.length > 0 &&
      ['PK', 'SK', 'GF'].includes(qualification.qualificationTypeCode)
    ) {
      promises.push(
        this.pctQualificationService.importPCTQualification(
          locationId,
          qualificationRecordId,
          qualification.monitoringQualificationPercentData,
          userId,
          trx,
        ),
      );
    }
    await Promise.all(promises);
  }

  async importQualification(
    qualifications: UpdateMonitorQualificationDTO[],
    locationId: string,
    userId: string,
    trx?: EntityManager,
  ) {
    await Promise.all(
      qualifications.map(async qualification => {
        const qualificationRecord = await withTransaction(
          this.repository,
          trx,
        ).getQualificationByLocTypeDate(
          locationId,
          qualification.qualificationTypeCode,
          qualification.beginDate,
          qualification.endDate,
        );

        if (qualificationRecord) {
          await this.updateQualification({
            locationId,
            qualId: qualificationRecord.id,
            payload: qualification,
            userId,
            isImport: true,
            trx,
          });

          await this.importQualPctLeeLmeCpms(
            locationId,
            qualificationRecord.id,
            qualification,
            userId,
            trx,
          );
        } else {
          const createdQualification = await this.createQualification({
            locationId,
            payload: qualification,
            userId,
            isImport: true,
            trx,
          });

          await this.importQualPctLeeLmeCpms(
            locationId,
            createdQualification.id,
            qualification,
            userId,
            trx,
          );
        }
      }),
    );
    this.logger.debug(`Imported ${qualifications.length} qualifications`);
    return true;
  }

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    const results = await this.repository.findBy({ locationId });
    return this.map.many(results);
  }

  async getQualification(
    locId: string,
    qualId: string,
    trx?: EntityManager,
  ): Promise<MonitorQualification> {
    const result = await withTransaction(this.repository, trx).getQualification(
      locId,
      qualId,
    );
    if (!result) {
      throw new EaseyException(
        new Error('Qualification Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          qualId: qualId,
        },
      );
    }
    return result;
  }

  async createQualification({
    locationId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    payload: MonitorQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorQualificationDTO> {
    const timestamp = currentDateTime();
    const repository = withTransaction(this.repository, trx);
    const qual = repository.create({
      id: uuid(),
      locationId,
      qualificationTypeCode: payload.qualificationTypeCode,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repository.save(qual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(qual);
  }

  async updateQualification({
    locationId,
    qualId,
    payload,
    userId,
    isImport = false,
    trx,
  }: {
    locationId: string;
    qualId: string;
    payload: MonitorQualificationBaseDTO;
    userId: string;
    isImport?: boolean;
    trx?: EntityManager;
  }): Promise<MonitorQualificationDTO> {
    const qual = await this.getQualification(locationId, qualId, trx);

    qual.userId = userId;
    qual.qualificationTypeCode = payload.qualificationTypeCode;
    qual.beginDate = payload.beginDate;
    qual.endDate = payload.endDate;
    qual.userId = userId;
    qual.updateDate = currentDateTime();

    const result = await withTransaction(this.repository, trx).save(qual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId, trx);
    }

    return this.map.one(result);
  }
}
