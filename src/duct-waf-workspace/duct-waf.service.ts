import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { DuctWafBaseDTO } from '../dtos/duct-waf.dto';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWaf } from '../entities/duct-waf.entity';

import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceService } from '../monitor-plan-workspace/monitor-plan.service';

@Injectable()
export class DuctWafWorkspaceService {
  constructor(
    @InjectRepository(DuctWafWorkspaceRepository)
    private readonly repository: DuctWafWorkspaceRepository,
    private readonly map: DuctWafMap,
    private readonly logger: Logger,
    private readonly mpService: MonitorPlanWorkspaceService,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getDuctWaf(id: string): Promise<DuctWaf> {
    const result = await this.repository.findOne(id);

    if (!result) {
      this.logger.error(NotFoundException, 'Duct Waf Not Found', true, {
        id: id,
      });
    }

    return result;
  }

  async createDuctWaf(
    locationId: string,
    payload: DuctWafBaseDTO,
    userId: string,
  ): Promise<DuctWafDTO> {
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

    await this.repository.save(ductWaf);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(ductWaf);
  }

  async updateDuctWaf(
    locationId: string,
    ductWafId: string,
    payload: DuctWafBaseDTO,
    userId: string,
  ): Promise<DuctWafDTO> {
    const ductWaf = await this.getDuctWaf(ductWafId);

    ductWaf.wafDeterminationDate = payload.wafDeterminationDate;
    ductWaf.wafBeginDate = payload.wafBeginDate;
    ductWaf.wafBeginHour = payload.wafBeginHour;
    ductWaf.wafMethodCode = payload.wafMethodCode;
    ductWaf.wafValue = payload.wafValue;
    ductWaf.numberOfTestRuns = payload.numberOfTestRuns;
    ductWaf.numberOfTraversePointsWaf = payload.numberOfTraversePointsWaf;
    ductWaf.numberOfTestPorts = payload.numberOfTestPorts;
    ductWaf.numberOfTraversePointsRef = payload.numberOfTraversePointsRef;
    ductWaf.ductWidth = payload.ductWidth;
    ductWaf.ductDepth = payload.ductDepth;
    ductWaf.wafEndDate = payload.wafEndDate;
    ductWaf.wafEndHour = payload.wafEndHour;
    ductWaf.userId = userId;
    ductWaf.updateDate = new Date(Date.now());

    await this.repository.save(ductWaf);
    await this.mpService.resetToNeedsEvaluation(locationId, userId);
    return this.map.one(ductWaf);
  }
}
