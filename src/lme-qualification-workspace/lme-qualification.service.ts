import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LMEQualificationMap } from '../maps/lme-qualification.map';
import {
  LMEQualificationBaseDTO,
  LMEQualificationDTO,
} from '../dtos/lme-qualification.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { LMEQualificationWorkspaceRepository } from './lme-qualification.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { MonitorQualificationWorkspaceService } from '../monitor-qualification-workspace/monitor-qualification.service';

@Injectable()
export class LMEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LMEQualificationWorkspaceRepository)
    private readonly repository: LMEQualificationWorkspaceRepository,
    private readonly map: LMEQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
    @Inject(forwardRef(() => MonitorQualificationWorkspaceService))
    private readonly mpQualService: MonitorQualificationWorkspaceService,
  ) {}

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
      throw new EaseyException(
        new Error('LME Qualification Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          qualId: qualId,
          lmeQualId: lmeQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async getLMEQualificationByDataYear(
    locId: string,
    qualId: string,
    qualDataYear: number,
  ): Promise<LMEQualificationDTO> {
    const result = await this.repository.getLMEQualificationByDataYear(
      locId,
      qualId,
      qualDataYear,
    );
    if (result) {
      return this.map.one(result);
    }
  }

  async createLMEQualification(
    locationId: string,
    qualId: string,
    payload: LMEQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<LMEQualificationDTO> {
    const qual = await this.mpQualService.getQualification(locationId, qualId);

    if (!['LMEA', 'LMES'].includes(qual.qualificationTypeCode)) {
      throw new EaseyException(
        new Error(
          'A Monitor Qualification LME record should not be reported for qualification type codes other than LMEA and LMES.',
        ),
        HttpStatus.BAD_REQUEST,
        {
          locationId: locationId,
          qualId: qualId,
        },
      );
    }

    const lmeQual = this.repository.create({
      id: uuid(),
      qualificationId: qual.id,
      qualificationDataYear: payload.qualificationDataYear,
      operatingHours: payload.operatingHours,
      so2Tons: payload.so2Tons,
      noxTons: payload.noxTons,
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await this.repository.save(lmeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updateLMEQualification(
    locationId: string,
    qualId: string,
    lmeQualId: string,
    payload: LMEQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<LMEQualificationDTO> {
    const lmeQual = await this.repository.getLMEQualification(
      locationId,
      qualId,
      lmeQualId,
    );

    lmeQual.qualificationId = qualId;
    lmeQual.qualificationDataYear = payload.qualificationDataYear;
    lmeQual.operatingHours = payload.operatingHours;
    lmeQual.so2Tons = payload.so2Tons;
    lmeQual.noxTons = payload.noxTons;
    lmeQual.userId = userId;
    lmeQual.updateDate = currentDateTime();

    const result = await this.repository.save(lmeQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async importLMEQualification(
    locationId: string,
    qualificationId: string,
    lmeQualifications: LMEQualificationBaseDTO[],
    userId: string,
  ) {
    return new Promise(resolve => {
      (async () => {
        const promises = [];
        for (const lmeQualification of lmeQualifications) {
          promises.push(
            new Promise(innerResolve => {
              (async () => {
                const lmeQualRecord = await this.getLMEQualificationByDataYear(
                  locationId,
                  qualificationId,
                  lmeQualification.qualificationDataYear,
                );

                if (lmeQualRecord) {
                  await this.updateLMEQualification(
                    locationId,
                    qualificationId,
                    lmeQualRecord.id,
                    lmeQualification,
                    userId,
                    true,
                  );
                } else {
                  await this.createLMEQualification(
                    locationId,
                    qualificationId,
                    lmeQualification,
                    userId,
                    true,
                  );
                }

                innerResolve(true);
              })();
            }),
          );
        }

        await Promise.all(promises);
        resolve(true);
      })();
    });
  }
}
