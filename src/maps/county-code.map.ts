import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { CountyCodeDTO } from '../dtos/county-code.dto';
import { CountyCode } from '../entities/county-code.entity';
import { CountyCodeService } from '../county-code/county-code.service';

@Injectable()
export class CountyCodeMap extends BaseMap<CountyCode, CountyCodeDTO> {
  public async one(entity: CountyCode): Promise<CountyCodeDTO> {
    return {
      countyCode: entity.countyCode,
      countyNumber: entity.countyNumber,
      countyName: entity.countyName,
      stateCode: entity.stateCode,
    };
  }
}
