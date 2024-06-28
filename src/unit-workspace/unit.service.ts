import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { ResponseHeaders } from '@us-epa-camd/easey-common/utilities';
import { Request } from 'express';

import { UnitParamsDTO } from '../dtos/unit.params.dto';
import { UnitMap } from '../maps/unit.map';
import { UnitWorkspaceRepository } from './unit.repository';

@Injectable()
export class UnitWorkspaceService {
  constructor(
    private readonly repository: UnitWorkspaceRepository,
    private readonly map: UnitMap,
  ) {}

  async getUnits(unitParamsDTO: UnitParamsDTO, req: Request) {
    const { facilityId, page, perPage } = unitParamsDTO;
    try {
      const [results, totalCount] = await this.repository.findAndCount({
        ...(facilityId && { where: { facId: facilityId } }),
        ...(page && perPage && { skip: (page - 1) * perPage, take: perPage }),
      });
      ResponseHeaders.setPagination(req, page, perPage, totalCount);
      return this.map.many(results);
    } catch (err) {
      throw new EaseyException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
