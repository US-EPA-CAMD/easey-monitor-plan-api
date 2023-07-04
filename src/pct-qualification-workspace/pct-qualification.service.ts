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
import { PCTQualificationMap } from '../maps/pct-qualification.map';
import {
  PCTQualificationBaseDTO,
  PCTQualificationDTO,
} from '../dtos/pct-qualification.dto';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';
import { PCTQualificationWorkspaceRepository } from './pct-qualification.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class PCTQualificationWorkspaceService {
  constructor(
    @InjectRepository(PCTQualificationWorkspaceRepository)
    private readonly repository: PCTQualificationWorkspaceRepository,
    private readonly map: PCTQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
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
      throw new EaseyException(
        'PCT Qualification Not Found',
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          qualId: qualId,
          pctQualId: pctQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async getPCTQualificationByDataYear(
    locId: string,
    qualId: string,
    qualDataYear: number,
  ): Promise<PCTQualificationDTO> {
    const result = await this.repository.getPCTQualificationByDataYear(
      locId,
      qualId,
      qualDataYear,
    );
    if (result) {
      return this.map.one(result);
    } else {
      return null;
    }
  }

  async createPCTQualification(
    locationId: string,
    qualId: string,
    payload: PCTQualificationBaseDTO,
    userId: string,
    isImport = false,
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
      userId: userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    const result = await this.repository.save(load);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.map.one(result);
  }

  async updatePCTQualification(
    locationId: string,
    qualId: string,
    pctQualId: string,
    payload: PCTQualificationBaseDTO,
    userId: string,
    isImport = false,
  ): Promise<PCTQualificationDTO> {
    const pctQual = await this.getPCTQualification(
      locationId,
      qualId,
      pctQualId,
    );

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
    pctQual.userId = userId;
    pctQual.updateDate = currentDateTime().toISOString();

    await this.repository.save(pctQual);

    if (!isImport) {
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    }

    return this.getPCTQualification(locationId, qualId, pctQualId);
  }

  async importPCTQualification(
    locationId: string,
    qualificationId: string,
    pctQualifications: PCTQualificationBaseDTO[],
    userId: string,
  ) {
    return new Promise(async resolve => {
      const promises = [];
      for (const pctQualification of pctQualifications) {
        promises.push(
          new Promise(async innerResolve => {
            const pctQualificationRecord = await this.getPCTQualificationByDataYear(
              locationId,
              qualificationId,
              pctQualification.qualificationYear,
            );

            if (pctQualificationRecord) {
              await this.updatePCTQualification(
                locationId,
                qualificationId,
                pctQualificationRecord.id,
                pctQualification,
                userId,
                true,
              );
            } else {
              await this.createPCTQualification(
                locationId,
                qualificationId,
                pctQualification,
                userId,
                true,
              );
            }

            innerResolve(true);
          }),
        );
      }

      await Promise.all(promises);
      resolve(true);
    });
  }
}
