import { CountyCode } from '../entities/county-code.entity';
import { CountyCodeMap } from './county-code.map';

const countyCode = '';
const countyNumber = '';
const countyName = '';
const stateCode = '';

const entity = new CountyCode();
entity.countyCode = countyCode;
entity.countyNumber = countyNumber;
entity.countyName = countyName;
entity.stateCode = stateCode;

describe('CountyCodeMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new CountyCodeMap();
    const result = await map.one(entity);

    expect(result.countyCode).toEqual(countyCode);
    expect(result.countyNumber).toEqual(countyNumber);
    expect(result.countyName).toEqual(countyName);
    expect(result.stateCode).toEqual(stateCode);
  });
});
