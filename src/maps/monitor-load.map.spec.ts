import { MonitorLoad } from '../entities/monitor-load.entity';
import { MonitorLoadMap } from './monitor-load.map';

const id = '';
const locationId = '';
const loadAnalysisDate = new Date(Date.now());
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;
const maximumLoadValue = 0;
const secondNormalIndicator = 0;
const upperOperationBoundary = 0;
const lowerOperationBoundary = 0;
const normalLevelCode = '';
const secondLevelCode = '';
const userId = '';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());
const maximumLoadUnitsOfMeasureCode = '';

const entity = new MonitorLoad();
entity.id = id;
entity.locationId = locationId;
entity.loadAnalysisDate = loadAnalysisDate;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;
entity.maximumLoadValue = maximumLoadValue;
entity.secondNormalIndicator = secondNormalIndicator;
entity.upperOperationBoundary = upperOperationBoundary;
entity.lowerOperationBoundary = lowerOperationBoundary;
entity.normalLevelCode = normalLevelCode;
entity.secondLevelCode = secondLevelCode;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;
entity.maximumLoadUnitsOfMeasureCode = maximumLoadUnitsOfMeasureCode;

describe('MonitorLoadMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new MonitorLoadMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.loadAnalysisDate).toEqual(loadAnalysisDate);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.beginHour).toEqual(beginHour);
    expect(result.endDate).toEqual(endDate);
    expect(result.endHour).toEqual(endHour);
    expect(result.maximumLoadValue).toEqual(maximumLoadValue);
    expect(result.secondNormalIndicator).toEqual(secondNormalIndicator);
    expect(result.upperOperationBoundary).toEqual(upperOperationBoundary);
    expect(result.lowerOperationBoundary).toEqual(lowerOperationBoundary);
    expect(result.normalLevelCode).toEqual(normalLevelCode);
    expect(result.secondLevelCode).toEqual(secondLevelCode);
    expect(result.userId).toEqual(userId);
    expect(result.addDate).toEqual(addDate);
    expect(result.updateDate).toEqual(updateDate);
    expect(result.maximumLoadUnitsOfMeasureCode).toEqual(
      maximumLoadUnitsOfMeasureCode,
    );
    expect(result.active).toEqual(false);
  });
});
