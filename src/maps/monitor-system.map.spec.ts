import { Test, TestingModule } from '@nestjs/testing';

import { MonitorSystem } from '../entities/monitor-system.entity';
import { MonitorSystemMap } from './monitor-system.map';
import { SystemComponentMap } from './system-component.map';
import { SystemFuelFlowMap } from './system-fuel-flow.map';

const id = '';
const locationId = '';
const monitoringSystemId = '';
const systemTypeCode = '';
const systemDesignationCode = '';
const fuelCode = '';
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;

const entity = new MonitorSystem();
entity.id = id;
entity.locationId = locationId;
entity.monitoringSystemId = monitoringSystemId;
entity.systemTypeCode = systemTypeCode;
entity.systemDesignationCode = systemDesignationCode;
entity.fuelCode = fuelCode;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;

describe('MonitorSystemMap', () => {
  let map: MonitorSystemMap;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [MonitorSystemMap, SystemFuelFlowMap, SystemComponentMap],
    }).compile();

    map = module.get(MonitorSystemMap);
  });

  it('maps an entity to a dto', async () => {
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.monitoringSystemId).toEqual(monitoringSystemId);
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
