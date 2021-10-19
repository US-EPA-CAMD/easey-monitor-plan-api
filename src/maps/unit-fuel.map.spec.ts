import { UnitFuel } from '../entities/unit-fuel.entity';
import { UnitFuelMap } from './unit-fuel.map';

/*
    unitFuel.fuelCode = payload.fuelCode;
    unitFuel.indicatorCode = payload.indicatorCode;
    unitFuel.ozoneSeasonIndicator = payload.ozoneSeasonIndicator;
    unitFuel.demGCV = payload.demGCV;
    unitFuel.demSO2 = payload.demSO2;
    unitFuel.beginDate = payload.beginDate;
    unitFuel.endDate = payload.endDate;
    unitFuel.userId = userId;
    unitFuel.updateDate = new Date(Date.now());
*/

const id = '';
const unitId = 6;
const fuelCode = '123';
const ozoneSeasonIndicator = 1;
const demGCV = null;
const demSO2 = null;
const beginDate = new Date(Date.now());
const endDate = new Date(Date.now());
const userId = 'testuser';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());

const entity = new UnitFuel();
entity.id = id;
entity.unitId = unitId;
entity.fuelCode = fuelCode;
entity.ozoneSeasonIndicator = ozoneSeasonIndicator;
entity.demGCV = demGCV;
entity.demSO2 = demSO2;
entity.beginDate = beginDate;
entity.endDate = endDate;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;

describe('UnitFuelMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new UnitFuelMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.unitId).toEqual(unitId);
    expect(result.fuelCode).toEqual(fuelCode);
    expect(result.ozoneSeasonIndicator).toEqual(ozoneSeasonIndicator);
    expect(result.demGCV).toEqual(demGCV);
    expect(result.demSO2).toEqual(demSO2);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.endDate).toEqual(endDate);
    expect(result.active).toEqual(false);
  });
});
