import { UnitControl } from '../entities/unit-control.entity';
import { UnitControlMap } from './unit-control.map';

const id = '';
const unitRecordId = 6;
const parameterCode = '';
const controlCode = '';
const originalCode = 1;
const installDate = new Date(Date.now());
const optimizationDate = new Date(Date.now());
const seasonalControlsIndicator = 0;
const retireDate = new Date(Date.now());
const userId = 'testuser';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());

const entity = new UnitControl();
entity.id = id;
entity.unitId = unitRecordId;
entity.parameterCode = parameterCode;
entity.controlCode = controlCode;
entity.originalCode = originalCode;
entity.installDate = installDate;
entity.optimizationDate = optimizationDate;
entity.seasonalControlsIndicator = seasonalControlsIndicator;
entity.retireDate = retireDate;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;

describe('UnitControlMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new UnitControlMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.unitRecordId).toEqual(unitRecordId);
    expect(result.parameterCode).toEqual(parameterCode);
    expect(result.controlCode).toEqual(controlCode);
    expect(result.originalCode).toEqual(originalCode);
    expect(result.installDate).toEqual(installDate);
    expect(result.optimizationDate).toEqual(optimizationDate);
    expect(result.seasonalControlsIndicator).toEqual(seasonalControlsIndicator);
    expect(result.retireDate).toEqual(retireDate);
    expect(result.active).toEqual(false);
  });
});
