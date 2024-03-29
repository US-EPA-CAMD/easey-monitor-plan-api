import { MatsMethod } from '../entities/mats-method.entity';
import { MatsMethodMap } from './mats-method.map';

const id = '';
const locationId = '';
const supplementalMATSParameterCode = '';
const supplementalMATSMonitoringMethodCode = '';
const beginDate = new Date(Date.now());
const beginHour = 12;
const endDate = new Date(Date.now());
const endHour = 12;

const entity = new MatsMethod();
entity.id = id;
entity.locationId = locationId;
entity.supplementalMATSParameterCode = supplementalMATSParameterCode;
entity.supplementalMATSMonitoringMethodCode = supplementalMATSMonitoringMethodCode;
entity.beginDate = beginDate;
entity.beginHour = beginHour;
entity.endDate = endDate;
entity.endHour = endHour;

describe('MatsMethodMap', () => {
  it('maps an entity to a dto', async () => {
    const map = new MatsMethodMap();
    const result = await map.one(entity);
    expect(result.id).toEqual(id);
    expect(result.locationId).toEqual(locationId);
    expect(result.supplementalMATSParameterCode).toEqual(
      supplementalMATSParameterCode,
    );
    expect(result.supplementalMATSMonitoringMethodCode).toEqual(
      supplementalMATSMonitoringMethodCode,
    );
    expect(result.beginDate).toEqual(beginDate);
    expect(result.beginHour).toEqual(beginHour);
    expect(result.endDate).toEqual(endDate);
    expect(result.endHour).toEqual(endHour);
    expect(result.active).toEqual(false);
  });
});
