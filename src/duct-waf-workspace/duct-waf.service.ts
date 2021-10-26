import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { UpdateDuctWafDTO } from '../dtos/duct-waf-update.dto';
import { DuctWafDTO } from '../dtos/duct-waf.dto';
import { DuctWafMap } from '../maps/duct-waf.map';
import { DuctWafWorkspaceRepository } from './duct-waf.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class DuctWafWorkspaceService {
  constructor(
    @InjectRepository(DuctWafWorkspaceRepository)
    private repository: DuctWafWorkspaceRepository,
    private map: DuctWafMap,
    private Logger: Logger,
  ) {}

  async getDuctWafs(locationId: string): Promise<DuctWafDTO[]> {
    const results = await this.repository.find({ locationId });
    return this.map.many(results);
  }

  async getDuctWaf(id: string) {
    const result = await this.repository.findOne(id);

    if (!result) {
      this.Logger.error(NotFoundException, 'Duct Waf Not Found', { id: id });
    }

    return this.map.one(result);
  }

  async createDuctWaf(
    locationId: string,
    payload: UpdateDuctWafDTO,
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
      // TODO - remove slice when userId constraints are fixed in the db
      userId: userId.slice(0, 7),
      addDate: new Date(Date.now()),
      updateDate: new Date(Date.now()),
    });

    const result = await this.repository.save(ductWaf);

    return this.map.one(result);
  }

  async updateDuctWaf(
    locationId: string,
    ductWafId: string,
    payload: UpdateDuctWafDTO,
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
    (ductWaf.numberOfTestPorts = payload.numberOfTestPorts),
      (ductWaf.numberOfTraversePointsRef = payload.numberOfTraversePointsRef);
    ductWaf.ductWidth = payload.ductWidth;
    ductWaf.ductDepth = payload.ductDepth;
    ductWaf.wafEndDate = payload.wafEndDate;
    ductWaf.wafEndHour = payload.wafEndHour;
    // TODO - remove slice when userId constraints are fixed in the db
    ductWaf.userId = userId.slice(0, 7);
    ductWaf.updateDate = new Date(Date.now());

    await this.repository.save(ductWaf);

    return this.getDuctWaf(ductWafId);
  }
}
