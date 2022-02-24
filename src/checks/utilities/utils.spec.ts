import { UpdateMonitorLocationDTO } from '../../dtos/monitor-location-update.dto';
import { MonitorLocation } from '../../entities/workspace/monitor-location.entity';
import * as utils from './utils';

describe('Monitor-Import Utilities Tests', () => {
  describe('getMonLocId', () => {
    it('Should return new location entity given a location record with stackPipeId', async () => {
      const expected = new MonitorLocation();

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(expected),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const loc = new UpdateMonitorLocationDTO();
      loc.stackPipeId = 'TEST';
      loc.unitId = null;

      const checkResult = await utils.getMonLocId(loc, 1);

      expect(checkResult).toBe(expected);
    });

    it('Should return new location entity given a location record with unitId', async () => {
      const expected = new MonitorLocation();

      const mockManager = {
        findOne: jest.fn().mockResolvedValue(expected),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const loc = new UpdateMonitorLocationDTO();
      loc.unitId = '1';
      loc.stackPipeId = null;

      const checkResult = await utils.getMonLocId(loc, 1);

      expect(checkResult).toBe(expected);
    });
  });

  describe('getFacIdFromOris', () => {
    it('Should return null given invalid oris code', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const checkResult = await utils.getFacIdFromOris(3);

      expect(checkResult).toBe(null);
    });

    it('Should return facilityId given valid oris code', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
      };
      jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      const checkResult = await utils.getFacIdFromOris(1);

      expect(checkResult).toBe(1);
    });
  });
});
