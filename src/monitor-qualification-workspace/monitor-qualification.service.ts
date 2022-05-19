import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
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
            );

            if (qualificationRecord !== undefined) {
              await this.updateQualification(
                userId,
                locationId,
                qualificationRecord.id,
                qualification,
              );

              if (
                qualification.leeQualifications &&
                qualification.leeQualifications.length > 0
              ) {
                innerPromises.push(
                  this.leeQualificationService.importLEEQualification(
                    locationId,
                    qualificationRecord.id,
                    qualification.leeQualifications,
                    userId,
                  ),
                );
              }

              if (
                qualification.lmeQualifications &&
                qualification.lmeQualifications.length > 0
              ) {
                innerPromises.push(
                  this.lmeQualificationService.importLMEQualification(
                    locationId,
                    qualificationRecord.id,
                    qualification.lmeQualifications,
                    userId,
                  ),
                );
              }

              if (
                qualification.pctQualifications &&
                qualification.pctQualifications.length > 0
              ) {
                innerPromises.push(
                  this.pctQualificationService.importPCTQualification(
                    locationId,
                    qualificationRecord.id,
                    qualification.pctQualifications,
                    userId,
                  ),
                );
              }
            } else {
              const createdQualification = await this.createQualification(
                userId,
                locationId,
                qualification,
              );

              if (
                qualification.leeQualifications &&
                qualification.leeQualifications.length > 0
              ) {
                innerPromises.push(
                  this.leeQualificationService.importLEEQualification(
                    locationId,
                    createdQualification.id,
                    qualification.leeQualifications,
                    userId,
                  ),
                );
              }

              if (
                qualification.lmeQualifications &&
                qualification.lmeQualifications.length > 0
              ) {
                innerPromises.push(
                  this.lmeQualificationService.importLMEQualification(
                    locationId,
                    createdQualification.id,
                    qualification.lmeQualifications,
                    userId,
                  ),
                );
              }

              if (
                qualification.lmeQualifications &&
                qualification.lmeQualifications.length > 0
              ) {
                innerPromises.push(
                  this.pctQualificationService.importPCTQualification(
                    locationId,
                    createdQualification.id,
                    qualification.pctQualifications,
                    userId,
                  ),
                );
              }
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
      this.logger.error(NotFoundException, 'Qualification Not Found', true, {
        locId: locId,
        qualId: qualId,
      });
    }
    return result;
  }

  async createQualification(
    userId: string,
    locationId: string,
    payload: MonitorQualificationBaseDTO,
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

    const result = await this.repository.save(qual);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(qual);
  }

  async updateQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: MonitorQualificationBaseDTO,
  ): Promise<MonitorQualificationDTO> {
    const qual = await this.getQualification(locId, qualId);

    qual.userId = userId;
    qual.qualificationTypeCode = payload.qualificationTypeCode;
    qual.beginDate = payload.beginDate;
    qual.endDate = payload.endDate;
    qual.userId = userId;
    qual.addDate = new Date(Date.now());
    qual.updateDate = new Date(Date.now());

    const result = await this.repository.save(qual);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }
}
