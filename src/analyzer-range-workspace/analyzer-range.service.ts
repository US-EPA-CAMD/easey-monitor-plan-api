import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuid } from 'uuid';

import { AnalyzerRangeDTO } from '../dtos/analyzer-range.dto';
import { UpdateAnalyzerRangeDTO } from '../dtos/analyzer-range-update.dto';

import { AnalyzerRangeMap } from '../maps/analyzer-range.map';

import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class AnalyzerRangeWorkspaceService {
  constructor(
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private repository: AnalyzerRangeWorkspaceRepository,
    private map: AnalyzerRangeMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getAnalyzerRanges(compId: string): Promise<AnalyzerRangeDTO[]> {
    this.logger.info('Getting analyzer range codes');

    let results;
    try {
      results = await this.repository.find({ componentRecordId: compId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got analyzer range codes');

    return this.map.many(results);
  }

  async getAnalyzerRange(analyzerRangeId: string): Promise<AnalyzerRangeDTO> {
    this.logger.info('Getting analyzer range');

    let results;
    try {
      results = await this.repository.findOne(analyzerRangeId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got analyzer range');

    if (!results) {
      this.logger.error(NotFoundException, 'Analyzer Range Not Found', true, {
        analyzerRangeId: analyzerRangeId,
      });
    }

    return this.map.one(results);
  }

  async createAnalyzerRange(
    componentRecordId: string,
    payload: UpdateAnalyzerRangeDTO,
    locationId: string,
    userId: string,
  ): Promise<AnalyzerRangeDTO> {
    this.logger.info('Creating analyzer range');

    let result;
    try {
      const analyzerRange = this.repository.create({
        id: uuid(),
        componentRecordId,
        analyzerRangeCode: payload.analyzerRangeCode,
        dualRangeIndicator: payload.dualRangeIndicator,
        beginDate: payload.beginDate,
        beginHour: payload.beginHour,
        endDate: payload.endDate,
        endHour: payload.endHour,
        userId: 'testuser',
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      result = await this.repository.save(analyzerRange);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Created analyzer range');

    return this.map.one(result);
  }

  async updateAnalyzerRangd(
    analyzerRangeId: string,
    payload: UpdateAnalyzerRangeDTO,
    locationId: string,
    userId: string,
  ): Promise<AnalyzerRangeDTO> {
    this.logger.info('Update analyzer range');

    let result;
    try {
      const analyzerRange = await this.getAnalyzerRange(analyzerRangeId);

      analyzerRange.analyzerRangeCode = payload.analyzerRangeCode;
      analyzerRange.dualRangeIndicator = payload.dualRangeIndicator;
      analyzerRange.beginDate = payload.beginDate;
      analyzerRange.beginHour = payload.beginHour;
      analyzerRange.endDate = payload.endDate;
      analyzerRange.endHour = payload.endHour;

      result = await this.repository.save(analyzerRange);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Updated analyzer range');

    return this.map.one(result);
  }
}
