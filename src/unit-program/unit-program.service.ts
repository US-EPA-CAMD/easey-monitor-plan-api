import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import { UnitProgramRepository } from './unit-program.repository';
import { UnitProgramMap } from '../maps/unit-program.map';
import { UnitProgramDTO } from '../dtos/unit-program.dto';

@Injectable()
export class UnitProgramService {
  constructor(
    private readonly repository: UnitProgramRepository,
    private readonly map: UnitProgramMap,
  ) {}

  async getUnitPrograms(locId: string, unitId: number): Promise<UnitProgramDTO[]> {
    const results = await this.repository.getUnitPrograms(locId, unitId);
    return this.map.many(results);
  }

  async getUnitProgram(
    locId: string,
    unitId: number,
    unitProgramId: string,
  ): Promise<UnitProgramDTO> {
    const result = await this.repository.getUnitProgram(unitProgramId);

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
