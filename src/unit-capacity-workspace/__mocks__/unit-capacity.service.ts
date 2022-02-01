import { unitCapacityStub } from '../test/stubs/unit-capacity.stub';

export const UnitCapacityWorkspaceService = jest.fn().mockReturnValue({
  getUnitCapacities: jest.fn().mockResolvedValue([unitCapacityStub()]),
  getUnitCapacity: jest.fn().mockResolvedValue(unitCapacityStub()),
  createUnitCapacity: jest.fn().mockResolvedValue(unitCapacityStub()),
  updateUnitCapacity: jest.fn().mockResolvedValue(unitCapacityStub()),
});
