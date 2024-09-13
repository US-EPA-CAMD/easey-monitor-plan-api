import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { UnitProgramWorkspaceRepository } from './unit-program.repository';
import { UnitProgramMap } from '../maps/unit-program.map';
import { UnitProgramDTO } from '../dtos/unit-program.dto';

@Injectable()
export class UnitProgramWorkspaceService {
  constructor(
    private readonly repository: UnitProgramWorkspaceRepository,
    private readonly map: UnitProgramMap,
  ) {}

  async getUnitProgramsByUnitRecordId(
    unitRecordId: number,
  ): Promise<UnitProgramDTO[]> {
    const results = await this.repository.getUnitProgramsByUnitRecordId(
      unitRecordId,
    );
    return this.map.many(results);
  }

  async getUnitProgramByProgramId(
    locId: string,
    unitId: number,
    unitProgramId: string,
  ): Promise<UnitProgramDTO> {
    const result = await this.repository.getUnitProgramByProgramId(
      unitProgramId,
    );

    if (!result) {
      throw new EaseyException(
        new Error('Unit Program Not Found'),
        HttpStatus.NOT_FOUND,
        {
          locId: locId,
          unitId: unitId,
          unitProgramId: unitProgramId,
        },
      );
    }

    return this.map.one(result);
  }
}
