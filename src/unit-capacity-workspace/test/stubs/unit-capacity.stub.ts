import { UnitCapacityDTO } from '../../../dtos/unit-capacity.dto';

export const unitCapacityStub = (): UnitCapacityDTO => {
  return {
    id: '1',
    unitRecordId: 1,
    commercialOperationDate: new Date(Date.now()),
    operationDate: new Date(Date.now()),
    boilerTurbineType: 'string',
    boilerTurbineBeginDate: new Date(Date.now()),
    boilerTurbineEndDate: new Date(Date.now()),
    maximumHourlyHeatInputCapacity: 2322,
    beginDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    userId: 'testUser',
    addDate: (new Date(Date.now())).toISOString(),
    updateDate: (new Date(Date.now())).toISOString(),
    active: true,
  };
};
