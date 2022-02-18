import * as utils from './utils';

describe('Monitor-Import Utilities Tests', () => {
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
