import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class LMEQualificationWorkspaceService {
  constructor(
    @InjectRepository(LMEQualificationWorkspaceRepository)
    private readonly repository: LMEQualificationWorkspaceRepository,
    private readonly map: LMEQualificationMap,
    private readonly logger: Logger,

    @Inject(forwardRef(() => MonitorPlanWorkspaceService))
    private readonly mpService: MonitorPlanWorkspaceService,
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
      this.logger.error(
        NotFoundException,
        'LME Qualification Not Found',
        true,
        {
          locId: locId,
          qualId: qualId,
          lmeQualId: lmeQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async createLMEQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: LMEQualificationBaseDTO,
  ): Promise<LMEQualificationDTO> {
    const lmeQual = this.repository.create({
      id: uuid(),
      qualificationId: qualId,
      qualificationDataYear: payload.qualificationDataYear,
      operatingHours: payload.operatingHours,
      so2Tons: payload.so2Tons,
      noxTons: payload.noxTons,
      userId: userId,
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(lmeQual);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }

  async updateLMEQualification(
    userId: string,
    locId: string,
    qualId: string,
    lmeQualId: string,
    payload: LMEQualificationBaseDTO,
  ): Promise<LMEQualificationDTO> {
    const lmeQual = await this.getLMEQualification(locId, qualId, lmeQualId);

    lmeQual.qualificationId = qualId;
    lmeQual.qualificationDataYear = payload.qualificationDataYear;
    lmeQual.operatingHours = payload.operatingHours;
    lmeQual.so2Tons = payload.so2Tons;
    lmeQual.noxTons = payload.noxTons;
    lmeQual.userId = userId;
    lmeQual.updateDate = new Date(Date.now());

    const result = await this.repository.save(lmeQual);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }
}
