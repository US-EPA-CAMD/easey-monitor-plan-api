import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import {
  MonitorQualificationBaseDTO,
  MonitorQualificationDTO,
} from '../dtos/monitor-qualification.dto';
import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { MonitorQualificationWorkspaceRepository } from './monitor-qualification.repository';
import { LEEQualificationWorkspaceService } from '../lee-qualification-workspace/lee-qualification.service';
import { LMEQualificationWorkspaceService } from '../lme-qualification-workspace/lme-qualification.service';
import { PCTQualificationWorkspaceService } from '../pct-qualification-workspace/pct-qualification.service';

@Injectable()
export class MonitorQualificationWorkspaceService {
  constructor(
    @InjectRepository(MonitorQualificationWorkspaceRepository)
    private readonly repository: MonitorQualificationWorkspaceRepository,
    private readonly map: MonitorQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,

    private readonly leeQualificationService: LEEQualificationWorkspaceService,
    private readonly lmeQualificationService: LMEQualificationWorkspaceService,
    private readonly pctQualificationService: PCTQualificationWorkspaceService,
  ) {}

  runQualificationImportCheck(qualifications: MonitorQualificationBaseDTO[]) {
    const errorList: string[] = [];

    for (const qual of qualifications) {
      if (qual.qualificationTypeCode !== 'LMEA') {
        qual.lmeQualifications.forEach((lmeQual, idx) => {
          if (lmeQual.so2Tons !== null) {
            errorList.push(
              `[IMPORT11-NONCRIT-A] A value has been reported for SO2Tons for the Monitor Qualification LME record #${idx}. This field should be blank`,
            );
          }
        });
      }

      if (
        !['PK', 'SK', 'GF'].includes(qual.qualificationTypeCode) &&
        qual.pctQualifications.length > 0
      ) {
        errorList.push(
          `[IMPORT12-FATAL-A] You have reported a MonitorQualPercent record for a location with the Qualification Type Code not equal to PK, SK or GF. A MonitorQualPercent record should not be reported for qualification Codes other than PK, SK or GF.`,
        );
      }

      if (
        !['LMEA', 'LMES'].includes(qual.qualificationTypeCode) &&
        qual.lmeQualifications.length > 0
      ) {
        errorList.push(
          `[IMPORT12-FATAL-B] You have reported a MonitorQualLME record for a location with the Qualification Type Code not equal to LMEA or LMES. A MonitorQualLME record should not be reported for qualification Codes other than LMEA or LMES.`,
        );
      }
    }

    return errorList;
  }

  private async importQualPctLeeLme(
    locationId: string,
    qualificationRecordId: string,
    qualification: MonitorQualificationBaseDTO,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      if (
        qualification.leeQualifications &&
        qualification.leeQualifications.length > 0
      ) {
        promises.push(
          this.leeQualificationService.importLEEQualification(
            locationId,
            qualificationRecordId,
            qualification.leeQualifications,
            userId,
          ),
        );
      }

      if (
        qualification.lmeQualifications &&
        qualification.lmeQualifications.length > 0
      ) {
        promises.push(
          this.lmeQualificationService.importLMEQualification(
            locationId,
            qualificationRecordId,
            qualification.lmeQualifications,
            userId,
          ),
        );
      }

      if (
        qualification.pctQualifications &&
        qualification.pctQualifications.length > 0
      ) {
        promises.push(
          this.pctQualificationService.importPCTQualification(
            locationId,
            qualificationRecordId,
            qualification.pctQualifications,
            userId,
          ),
        );
      }
      await Promise.all(promises);
      resolve(true);
    });
  }

  async importQualification(
    qualifications: MonitorQualificationBaseDTO[],
    locationId: string,
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const qualification of qualifications) {
        promises.push(
          new Promise(async innerResolve => {
            const innerPromises = [];
            const qualificationRecord = await this.repository.getQualificationByLocTypeDate(
              locationId,
              qualification.qualificationTypeCode,
              qualification.beginDate,
              qualification.endDate,

            );

            if (qualificationRecord !== undefined) {
              await this.updateQualification(
                locationId,
                qualificationRecord.id,
                qualification,
                userId,
                true,
              );

              innerPromises.push(
                this.importQualPctLeeLme(
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
                this.importQualPctLeeLme(
                  locationId,
                  createdQualification.id,
                  qualification,
                  userId,
                ),
              );
            }

            await Promise.all(innerPromises);
            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
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
      throw new LoggingException(
        'Qualification Not Found',
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
    const qual = this.repository.create({
      id: uuid(),
      locationId,
      qualificationTypeCode: payload.qualificationTypeCode,
      beginDate: payload.beginDate,
      endDate: payload.endDate,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
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
    qual.addDate = new Date(Date.now());
    qual.updateDate = new Date(Date.now());

    const result = await this.repository.save(qual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }
}
