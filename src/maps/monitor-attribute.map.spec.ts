import { MonitorAttribute } from '../entities/monitor-attribute.entity';
import { MonitorAttributeMap } from './monitor-attribute.map';

const id = '';
const locationId = '';
const ductIndicator = 1;
const bypassIndicator = 1;
const groundElevation = 1;
const stackHeight = 1;
const materialCode = '';
const shapeCode = '';
const crossAreaFlow = 1;
const crossAreaStackExit = 1;
const beginDate = new Date(Date.now());
const endDate = new Date(Date.now());
const userId = 'testuser';
const addDate = new Date(Date.now());
const updateDate = new Date(Date.now());

const entity = new MonitorAttribute();
entity.id = id;
entity.locationId = locationId;
entity.ductIndicator = ductIndicator;
entity.bypassIndicator = bypassIndicator;
entity.groundElevation = groundElevation;
entity.stackHeight = stackHeight;
entity.materialCode = materialCode;
entity.shapeCode = shapeCode;
entity.crossAreaFlow = crossAreaFlow;
entity.crossAreaStackExit = crossAreaStackExit;
entity.beginDate = beginDate;
entity.endDate = endDate;
entity.userId = userId;
entity.addDate = addDate;
entity.updateDate = updateDate;

describe('MonitorAttributeMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new MonitorAttributeMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.ductIndicator).toEqual(ductIndicator);
    expect(result.bypassIndicator).toEqual(bypassIndicator);
    expect(result.groundElevation).toEqual(groundElevation);
    expect(result.stackHeight).toEqual(stackHeight);
    expect(result.materialCode).toEqual(materialCode);
    expect(result.shapeCode).toEqual(shapeCode);
    expect(result.crossAreaFlow).toEqual(crossAreaFlow);
    expect(result.crossAreaStackExit).toEqual(crossAreaStackExit);
    expect(result.beginDate).toEqual(beginDate);
    expect(result.endDate).toEqual(endDate);
    expect(result.userId).toEqual(userId);
    expect(result.addDate).toEqual(addDate);
    expect(result.updateDate).toEqual(updateDate);
    expect(result.active).toEqual(true);
  });
});
