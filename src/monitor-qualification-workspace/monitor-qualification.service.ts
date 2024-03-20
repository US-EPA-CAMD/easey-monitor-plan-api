import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import {
  MonitorQualificationBaseDTO,
  MonitorQualificationDTO,
  UpdateMonitorQualificationDTO,
} from '../dtos/monitor-qualification.dto';
import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { LEEQualificationWorkspaceService } from '../lee-qualification-workspace/lee-qualification.service';
import { LMEQualificationWorkspaceService } from '../lme-qualification-workspace/lme-qualification.service';
import { PCTQualificationWorkspaceService } from '../pct-qualification-workspace/pct-qualification.service';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { CPMSQualificationWorkspaceService } from '../cpms-qualification-workspace/cpms-qualification-workspace.service';

@Injectable()
export class MonitorQualificationWorkspaceService {
  constructor(
    @InjectRepository(MonitorQualificationWorkspaceRepository)
    private readonly repository: MonitorQualificationWorkspaceRepository,
    private readonly map: MonitorQualificationMap,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,

    private readonly leeQualificationService: LEEQualificationWorkspaceService,
    private readonly lmeQualificationService: LMEQualificationWorkspaceService,
    private readonly pctQualificationService: PCTQualificationWorkspaceService,
    private readonly cpmsQualificationService: CPMSQualificationWorkspaceService,
  ) {}

  runQualificationImportCheck(qualifications: UpdateMonitorQualificationDTO[]) {
    const errorList: string[] = [];

    for (const qual of qualifications) {

      if(qual.endDate) continue; // Don't perform checks on Inactive MonitorQualification Record
      
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
        qual.qualificationTypeCode !== 'CPMS' &&
        qual.monitoringQualificationCPMSData.length > 0
      ) {
        errorList.push(
          `[IMPORT12-FATAL-C] You have reported a MonitorQualCPMS record for a location with the Qualification Type Code not equal to CPMS. A MonitorQualCPMS record should not be reported for qualification type codes other than CPMS.`,
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
        ),
      );
    }

    if (
      qualification.monitoringQualificationCPMSData?.length > 0 &&
      qualification.qualificationTypeCode === 'CPMS'
    ) {
      promises.push(
        this.cpmsQualificationService.importCPMSQualifications(
          locationId,
          qualificationRecordId,
          qualification.monitoringQualificationCPMSData,
          userId,
        ),
      );
    }
    await Promise.all(promises);
  }

  async importQualification(
    qualifications: UpdateMonitorQualificationDTO[],
    locationId: string,
    userId: string,
  ): Promise<void> {
    const promises = qualifications.map(async qualification => {
      const innerPromises = [];
      const qualificationRecord = await this.repository.getQualificationByLocTypeDate(
        locationId,
        qualification.qualificationTypeCode,
        qualification.beginDate,
        qualification.endDate,
      );

      if (qualificationRecord) {
        await this.updateQualification(
          locationId,
          qualificationRecord.id,
          qualification,
          userId,
          true,
        );

        innerPromises.push(
          this.importQualPctLeeLmeCpms(
            locationId,
            qualificationRecord.id,
            qualification,
            userId,
          ),
        );
      } else {
        const createdQualification = await this.createQualification(
          locationId,
          qualification,
          userId,
          true,
        );

        innerPromises.push(
          this.importQualPctLeeLmeCpms(
            locationId,
            createdQualification.id,
            qualification,
            userId,
          ),
        );
      }

      await Promise.all(innerPromises);
    });

    await Promise.all(promises);
  }

  async getQualifications(
    locationId: string,
  ): Promise<MonitorQualificationDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getQualification(
    locId: string,
    qualId: string,
  ): Promise<MonitorQualification> {
    const result = await this.repository.getQualification(locId, qualId);
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

  async createQualification(
    locationId: string,
    payload: MonitorQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<MonitorQualificationDTO> {
    const timestamp = currentDateTime();
    const qual = this.repository.create({
      id: uuid(),
      locationId,
      qualificationTypeCode: payload.qualificationTypeCode,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(qual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(qual);
  }

  async updateQualification(
    locationId: string,
    qualId: string,
    payload: MonitorQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<MonitorQualificationDTO> {
    const qual = await this.getQualification(locationId, qualId);

    qual.userId = userId;
    qual.qualificationTypeCode = payload.qualificationTypeCode;
    qual.beginDate = payload.beginDate;
    qual.endDate = payload.endDate;
    qual.userId = userId;
    qual.updateDate = currentDateTime();

    const result = await this.repository.save(qual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }
}
