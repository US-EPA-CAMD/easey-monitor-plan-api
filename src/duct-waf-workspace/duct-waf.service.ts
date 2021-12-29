import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateDuctWafDTO } from '../dtos/duct-waf-update.dto';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class DuctWafWorkspaceService {
  constructor(
    @InjectRepository(DuctWafWorkspaceRepository)
    private repository: DuctWafWorkspaceRepository,
    private map: DuctWafMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    this.logger.info('Getting duct wafs');

    let result;
    try {
      result = await this.repository.find({ locationId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got duct wafs');

    return this.map.many(result);
  }

  async getDuctWaf(id: string) {
    this.logger.info('Getting duct waf');

    let result;
    try {
      result = await this.repository.findOne(id);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Got duct wafs');

    if (!result) {
      this.logger.error(NotFoundException, 'Duct Waf Not Found', true, {
        id: id,
      });
    }

    return this.map.one(result);
  }

  async createDuctWaf(
    locationId: string,
    payload: UpdateDuctWafDTO,
    userId: string,
  ): Promise<DuctWafDTO> {
    this.logger.info('Creating duct waf');

    let result;
    try {
      const ductWaf = this.repository.create({
        id: uuid(),
        locationId,
        wafDeterminationDate: payload.wafDeterminationDate,
        wafBeginDate: payload.wafBeginDate,
        wafBeginHour: payload.wafBeginHour,
        wafMethodCode: payload.wafMethodCode,
        wafValue: payload.wafValue,
        numberOfTestRuns: payload.numberOfTestRuns,
        numberOfTraversePointsWaf: payload.numberOfTraversePointsRef,
        numberOfTestPorts: payload.numberOfTestPorts,
        numberOfTraversePointsRef: payload.numberOfTraversePointsRef,
        ductWidth: payload.ductWidth,
        ductDepth: payload.ductDepth,
        wafEndDate: payload.wafEndDate,
        wafEndHour: payload.wafEndHour,
        userId: userId,
        addDate: new Date(Date.now()),
        updateDate: new Date(Date.now()),
      });

      result = await this.repository.save(ductWaf);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    this.logger.info('Created duct waf');

    return this.map.one(result);
  }

  async updateDuctWaf(
    locationId: string,
    ductWafId: string,
    payload: UpdateDuctWafDTO,
    userId: string,
  ): Promise<DuctWafDTO> {
    this.logger.info('Updating duct waf');

    try {
      const ductWaf = await this.getDuctWaf(ductWafId);

      ductWaf.wafDeterminationDate = payload.wafDeterminationDate;
      ductWaf.wafBeginDate = payload.wafBeginDate;
      ductWaf.wafBeginHour = payload.wafBeginHour;
      ductWaf.wafMethodCode = payload.wafMethodCode;
      ductWaf.wafValue = payload.wafValue;
      ductWaf.numberOfTestRuns = payload.numberOfTestRuns;
      ductWaf.numberOfTraversePointsWaf = payload.numberOfTraversePointsWaf;
      (ductWaf.numberOfTestPorts = payload.numberOfTestPorts),
        (ductWaf.numberOfTraversePointsRef = payload.numberOfTraversePointsRef);
      ductWaf.ductWidth = payload.ductWidth;
      ductWaf.ductDepth = payload.ductDepth;
      ductWaf.wafEndDate = payload.wafEndDate;
      ductWaf.wafEndHour = payload.wafEndHour;
      ductWaf.userId = userId;
      ductWaf.updateDate = new Date(Date.now());

      await this.repository.save(ductWaf);
      await this.mpService.resetToNeedsEvaluation(locationId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    this.logger.info('Updated duct waf');

    return this.getDuctWaf(ductWafId);
  }
}
