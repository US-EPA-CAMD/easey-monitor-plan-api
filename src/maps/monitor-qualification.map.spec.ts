import { Test, TestingModule } from '@nestjs/testing';
import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { MonitorQualificationMap } from './monitor-qualification.map';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { LEEQualificationMap } from './lee-qualification.map';
import { LMEQualificationMap } from './lme-qualification.map';
import { PCTQualificationMap } from './pct-qualification.map';

const id = '';
const locationId = '';
const qualificationTypeCode = '0';
const beginDate = new Date(Date.now());
const endDate = new Date(Date.now());
const userId = '1';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());
// const location = {};
const leeQualifications = [];
const lmeQualifications = [];
const pctQualifications = [];

const entity = new MonitorQualification();
const location = new MonitorLocation();

entity.id = id;
entity.locationId = locationId;
entity.qualificationTypeCode = qualificationTypeCode;
entity.beginDate = beginDate;
entity.endDate = endDate;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;
entity.location = location;
entity.leeQualifications = leeQualifications;
entity.lmeQualifications = lmeQualifications;
entity.pctQualifications = pctQualifications;

describe('MonitorQualification', () => {
  let map: MonitorQualificationMap;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        MonitorQualification,
        MonitorQualificationMap,
        LEEQualificationMap,
        LMEQualificationMap,
        PCTQualificationMap,
      ],
    }).compile();

    map = module.get(MonitorQualificationMap);
  });

  it('maps a monitor qualificatioin entity to its dto', async () => {
    const result = await map.one(entity);

    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.qualificationTypeCode).toEqual(qualificationTypeCode);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.endDate).toEqual(endDate);
    expect(result.userId).toEqual(userId);
    expect(result.addDate).toEqual(addDate);
    // expect(result.location).toEqual(location);
    expect(result.leeQualifications).toEqual(leeQualifications);
    expect(result.lmeQualifications).toEqual(lmeQualifications);
    expect(result.pctQualifications).toEqual(pctQualifications);
  });
});
