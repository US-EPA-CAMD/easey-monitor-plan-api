import { Test, TestingModule } from '@nestjs/testing';
import { VwMPLocationsAndUnitStackConfigurationsMap } from './vw-mp-locations-and-unit-stack-configurations.map';
import { VwMPLocationsAndUnitStackConfigurations } from '../entities/workspace/vw-mp-locations-and-unit-stack-configurations.entity';

// Mock data for the entity
const id = 'MOCK-ID-123';
const facId = 1;
const facilityName = 'Barry';
const orisCode = 3;
const name = '1, 2, CS0AAN';
const endReportPeriodId = 120;
const beginReportPeriodId = 1;
const beginReportPeriodDescription = '2023 Q1';
const endReportPeriodDescription = '2025 Q4';
const userId = 'testuser';
const addDate = new Date();
const updateDate = new Date();

// Create a mock entity instance
const entity = new VwMPLocationsAndUnitStackConfigurations();
entity.id = id;
entity.facId = facId;
entity.facilityName = facilityName;
entity.orisCode = orisCode;
entity.name = name;
entity.beginReportPeriodId = beginReportPeriodId;
entity.endReportPeriodId = endReportPeriodId;
entity.beginReportPeriodDescription = beginReportPeriodDescription;
entity.endReportPeriodDescription = endReportPeriodDescription;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;
// Add other entity properties as needed for the test
entity.facilityRegistrySystemId = 'FRS-ID-456';
entity.configTypeCode = 'DEFAULT';
entity.lastUpdated = new Date();
entity.updatedStatusFlag = 'Y';
entity.needsEvalFlag = 'Y';
entity.checkSessionId = 'SESSION-ID-789';
entity.pendingStatusCode = 'PENDING';
entity.evalStatusCode = 'PASS';
entity.evalStatusCodeDescription = 'Passed';
entity.severityCode = 'CRITICAL';
entity.severityDescription = 'Critical Error';
entity.submissionId = 987;
entity.submissionAvailabilityCode = 'AVAIL';
entity.lastEvaluatedDate = new Date();

describe('VwMPLocationsAndUnitStackConfigurationsMap', () => {
  let map: VwMPLocationsAndUnitStackConfigurationsMap;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [VwMPLocationsAndUnitStackConfigurationsMap],
    }).compile();

    map = module.get(VwMPLocationsAndUnitStackConfigurationsMap);
  });

  it('maps a VwMPLocationsAndUnitStackConfigurations entity to its MonitorPlanDTO', async () => {
    const result = await map.one(entity);

    expect(result.id).toEqual(id);
    expect(result.facId).toEqual(facId);
    expect(result.facilityName).toEqual(facilityName);
    expect(result.orisCode).toEqual(orisCode);
    expect(result.name).toEqual(name);
    expect(result.beginReportPeriodId).toEqual(beginReportPeriodId);
    expect(result.endReportPeriodId).toEqual(endReportPeriodId);
    expect(result.beginReportPeriodDescription).toEqual(beginReportPeriodDescription);
    expect(result.endReportPeriodDescription).toEqual(endReportPeriodDescription);
    expect(result.active).toEqual(false);
    expect(result.userId).toEqual(userId);
    expect(result.addDate).toEqual(addDate.toISOString());
    expect(result.updateDate).toEqual(updateDate.toISOString());

    entity.endReportPeriodId = null;
    const activeResult = await map.one(entity);
    expect(activeResult.active).toEqual(true);
  });
});