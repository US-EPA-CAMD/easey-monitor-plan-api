import { MatsMethod } from '../entities/mats-method.entity';
import { MatsMethodMap } from './mats-method.map';

const id = '';
const monLocId = '';
const matsMethodParameterCode = '';
const matsMethodCode = '';
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;

const entity = new MatsMethod();
entity.id = id;
entity.monLocId = monLocId;
entity.matsMethodParameterCode = matsMethodParameterCode;
entity.matsMethodCode = matsMethodCode;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;

describe('MatsMethodMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new MatsMethodMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.monLocId).toEqual(monLocId);
    expect(result.matsMethodParameterCode).toEqual(matsMethodParameterCode);
    expect(result.matsMethodCode).toEqual(matsMethodCode);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.beginHour).toEqual(beginHour);
    expect(result.endDate).toEqual(endDate);
    expect(result.endHour).toEqual(endHour);
    expect(result.active).toEqual(false);
  });
});
