import { AnalyzerRange } from '../entities/analyzer-range.entity';
import { AnalyzerRangeMap } from './analyzer-range.map';

const id = '';
const componentId = '';
const analyzerRangeCode = '';
const dualRangeIndicator = 0;
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;

const entity = new AnalyzerRange();
entity.id = id;
entity.componentRecordId = componentId;
entity.analyzerRangeCode = analyzerRangeCode;
entity.dualRangeIndicator = dualRangeIndicator;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;

describe('AnalyzerRangeMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new AnalyzerRangeMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.componentRecordId).toEqual(componentId);
    expect(result.analyzerRangeCode).toEqual(analyzerRangeCode);
    expect(result.dualRangeIndicator).toEqual(dualRangeIndicator);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.beginHour).toEqual(beginHour);
    expect(result.endDate).toEqual(endDate);
    expect(result.endHour).toEqual(endHour);
    expect(result.active).toEqual(false);
  });
});
