import {
  forwardRef,
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
      this.logger.error(
        NotFoundException,
        'PCT Qualification Not Found',
        true,
        {
          locId: locId,
          qualId: qualId,
          pctQualId: pctQualId,
        },
      );
    }
    return this.map.one(result);
  }

  async createPCTQualification(
    userId: string,
    locId: string,
    qualId: string,
    payload: PCTQualificationBaseDTO,
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
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(load);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.map.one(result);
  }

  async updatePCTQualification(
    userId: string,
    locId: string,
    qualId: string,
    pctQualId: string,
    payload: PCTQualificationBaseDTO,
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
    pctQual.userId = userId;
    pctQual.updateDate = new Date(Date.now());

    await this.repository.save(pctQual);
    await this.mpService.resetToNeedsEvaluation(locId, userId);
    return this.getPCTQualification(locId, qualId, pctQualId);
  }
}
