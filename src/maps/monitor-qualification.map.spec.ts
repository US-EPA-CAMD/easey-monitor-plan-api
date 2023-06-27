import { Test, TestingModule } from '@nestjs/testing';
import { MonitorQualification } from '../entities/monitor-qualification.entity';
import { MonitorQualificationMap } from './monitor-qualification.map';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { LEEQualificationMap } from './lee-qualification.map';
import { LMEQualificationMap } from './lme-qualification.map';
import { PCTQualificationMap } from './pct-qualification.map';
import { LEEQualification } from '../entities/lee-qualification.entity';
import { LMEQualification } from '../entities/lme-qualification.entity';
import { PCTQualification } from '../entities/pct-qualification.entity';
import { PCTQualificationDTO } from '../dtos/pct-qualification.dto';
import { LMEQualificationDTO } from '../dtos/lme-qualification.dto';
import { LEEQualificationDTO } from '../dtos/lee-qualification.dto';

const id = '';
const locationId = '';
const qualificationTypeCode = '0';
const beginDate = new Date(Date.now());
const endDate = new Date(Date.now());
const userId = '1';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());
const leeQualifications = [new LEEQualification()];
const lmeQualifications = [new LMEQualification()];
const pctQualifications = [new PCTQualification()];

const leeQualDto: LEEQualificationDTO = {
  addDate: null,
  applicableEmissionStandard: undefined,
  id: undefined,
  parameterCode: undefined,
  percentageOfEmissionStandard: undefined,
  potentialAnnualMassEmissions: undefined,
  qualificationId: undefined,
  qualificationTestDate: undefined,
  qualificationTestType: undefined,
  unitsOfStandard: undefined,
  updateDate: null,
  userId: undefined,
};

const lmeQualDto: LMEQualificationDTO = {
  addDate: null,
  id: undefined,
  noxTons: undefined,
  operatingHours: undefined,
  qualificationDataYear: undefined,
  qualificationId: undefined,
  so2Tons: undefined,
  updateDate: null,
  userId: undefined,
};
const pctQualDto: PCTQualificationDTO = {
  addDate: null,
  averagePercentValue: undefined,
  id: undefined,
  qualificationId: undefined,
  qualificationYear: undefined,
  updateDate: null,
  userId: undefined,
  yr1PercentageValue: undefined,
  yr1QualificationDataTypeCode: undefined,
  yr1QualificationDataYear: undefined,
  yr2PercentageValue: undefined,
  yr2QualificationDataTypeCode: undefined,
  yr2QualificationDataYear: undefined,
  yr3PercentageValue: undefined,
  yr3QualificationDataTypeCode: undefined,
  yr3QualificationDataYear: undefined,
};

const entity = new MonitorQualification();

entity.id = id;
entity.locationId = locationId;
entity.qualificationTypeCode = qualificationTypeCode;
entity.beginDate = beginDate;
entity.endDate = endDate;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;
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
    expect(result.addDate).toEqual(addDate.toISOString());
    expect(result.updateDate).toEqual(updateDate.toISOString());
    expect(result.leeQualifications).toEqual([leeQualDto]);
    expect(result.lmeQualifications).toEqual([lmeQualDto]);
    expect(result.pctQualifications).toEqual([pctQualDto]);
  });

  it('Should return empty array when leeQual, lmeQual and pctQual does not exists', async () => {
    delete entity.leeQualifications;
    delete entity.lmeQualifications;
    delete entity.pctQualifications;

    const result = await map.one(entity);

    expect(result.leeQualifications).toEqual([]);
    expect(result.lmeQualifications).toEqual([]);
    expect(result.pctQualifications).toEqual([]);
  });
});
