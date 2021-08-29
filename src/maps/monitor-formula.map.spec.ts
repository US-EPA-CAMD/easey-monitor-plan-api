import { MonitorFormula } from '../entities/monitor-formula.entity';
import { MonitorFormulaMap } from './monitor-formula.map';

const id = '';
const locationId = '';
const parameterCode = '';
const formulaCode = '';
const formulaId = '';
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;
const formulaText = '';
const userId = '';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());

const entity = new MonitorFormula();
entity.id = id;
entity.locationId = locationId;
entity.parameterCode = parameterCode;
entity.formulaCode = formulaCode;
entity.formulaId = formulaId;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;
entity.formulaText = formulaText;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;

describe('MonitorFormulaMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new MonitorFormulaMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.parameterCode).toEqual(parameterCode);
    expect(result.formulaCode).toEqual(formulaCode);
    expect(result.formulaId).toEqual(formulaId);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.beginHour).toEqual(beginHour);
    expect(result.endDate).toEqual(endDate);
    expect(result.endHour).toEqual(endHour);
    expect(result.formulaText).toEqual(formulaText);
    expect(result.userId).toEqual(userId);
    expect(result.addDate).toEqual(addDate);
    expect(result.updateDate).toEqual(updateDate);
    expect(result.active).toEqual(false);
  });
});
