import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemMap } from './monitor-system.map';

const id = '';
const monLocId = '';
const systemIdentifier = '';
const systemTypeCode = '';
const systemDesignationCode = '';
const fuelCode = '';
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;

const entity = new MonitorSystem();
entity.id = id;
entity.monLocId = monLocId;
entity.systemIdentifier = systemIdentifier;
entity.systemTypeCode = systemTypeCode;
entity.systemDesignationCode = systemDesignationCode;
entity.fuelCode = fuelCode;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;

describe('MonitorSystemMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new MonitorSystemMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.monLocId).toEqual(monLocId);
    expect(result.systemIdentifier).toEqual(systemIdentifier);
    expect(result.systemTypeCode).toEqual(systemTypeCode);
    expect(result.systemDesignationCode).toEqual(systemDesignationCode);
    expect(result.fuelCode).toEqual(fuelCode);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.beginHour).toEqual(beginHour);
    expect(result.endDate).toEqual(endDate);
    expect(result.endHour).toEqual(endHour);
    expect(result.active).toEqual(false);
  });
});
