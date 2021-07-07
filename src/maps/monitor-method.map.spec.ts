import { MonitorMethod } from '../entities/monitor-method.entity';
import { MonitorMethodMap } from './monitor-method.map';

const id = '';
const monLocId = '';
const parameterCode = '';
const methodCode = '';
const subDataCode = '';
const bypassApproachCode = '';
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;
const userId = '';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());

const entity = new MonitorMethod();
entity.id = id;
entity.monLocId = monLocId;
entity.parameterCode = parameterCode;
entity.methodCode = methodCode;
entity.subDataCode = subDataCode;
entity.bypassApproachCode = bypassApproachCode;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;

describe('MonitorMethodMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new MonitorMethodMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.monLocId).toEqual(monLocId);
    expect(result.parameterCode).toEqual(parameterCode);
    expect(result.methodCode).toEqual(methodCode);
    expect(result.subDataCode).toEqual(subDataCode);
    expect(result.bypassApproachCode).toEqual(bypassApproachCode);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.beginHour).toEqual(beginHour);
    expect(result.endDate).toEqual(endDate);
    expect(result.endHour).toEqual(endHour);
    expect(result.userId).toEqual(userId);
    expect(result.addDate).toEqual(addDate);
    expect(result.updateDate).toEqual(updateDate);
    expect(result.active).toEqual(false);
  });
});
